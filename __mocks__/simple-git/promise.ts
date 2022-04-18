export const addConfig = jest.fn()
export const add = jest.fn()
export const commit = jest.fn()
export const push = jest.fn()

export default function simpleGit(): unknown {
  return {
    addConfig,
    add,
    commit,
    push
  }
}
