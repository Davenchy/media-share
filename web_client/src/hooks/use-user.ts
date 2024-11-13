import { api } from "@/lib/api/api"
import type { IUser } from "@/lib/api/api"
import { useState, useEffect } from "react"

interface UserState {
  state: "IDLE" | "UNAUTHORIZED" | "AUTHORIZED" | "CHECKING"
  token?: string
  user?: IUser
}

const STORAGE_KEY = "USER_STATE"
const listeners: ((state: UserState) => void)[] = []
let currentState: UserState = { state: "IDLE" }

/**
 * Update the current state and notify all listeners
 */
const applyChange = (newState: UserState) => {
  currentState = newState
  for (const listener of listeners) listener(newState)
}

/**
 * API endpoint to fetch the user data
 * Returns user object if succeeded
 */
async function fetchUser(token: string): Promise<IUser> {
  // !TODO: move to separated file
  const res = await api.get("/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (res.status !== 200) throw new Error("Unauthorized")
  return res.data
}

/**
 * Tries to login using the probided access **token**
 * On success, sets the current user state and store the session to the
 * localStorage, use `restoreSession()` to restore the session next time.
 * Use `logout()` to logout and clear the session.
 */
export async function login(token: string) {
  applyChange({ ...currentState, state: "CHECKING" })
  // use the token to fetch user
  let user: IUser

  try {
    user = await fetchUser(token)
  } catch (err) {
    console.error(err)
    logout()
    return
  }

  // store token in local storage
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }))

  // set the current state
  applyChange({ token, user, state: "AUTHORIZED" })
}

/**
 *
 * checks the local storage and get the user state if exist, then validates it
 * by tring to login with the stored access token.
 */
export async function restoreSession() {
  applyChange({ ...currentState, state: "CHECKING" })

  // check storage
  const storageContent = localStorage.getItem(STORAGE_KEY)
  if (!storageContent) {
    applyChange({ state: "UNAUTHORIZED" })
    return
  }
  let storage: UserState

  try {
    storage = JSON.parse(storageContent)
  } catch (err) {
    console.error(err)
    applyChange({ state: "UNAUTHORIZED" })
    return
  }

  // validate storage token
  if (storage.token) await login(storage.token)
}

/**
 * Clears the current session
 */
export function logout() {
  // clear local storage
  localStorage.removeItem(STORAGE_KEY)
  // set the current state
  applyChange({ state: "UNAUTHORIZED" })
}

/**
 * Access the current user session and refresh on state changes
 */
export function useUser() {
  const [state, setState] = useState<UserState>(currentState)

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [state])

  return {
    get isLoggedIn(): boolean {
      return state.state === "AUTHORIZED"
    },
    get isChecking(): boolean {
      return state.state === "CHECKING"
    },
    get isLoggedOut(): boolean {
      return state.state === "UNAUTHORIZED"
    },
    state: state.state,
    token: state.token as string,
    user: state.user as IUser,
    restoreSession,
    logout,
  }
}
