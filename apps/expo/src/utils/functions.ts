export const getRandomChoice = <T>(arr: T[]) => {
  return arr[Math.floor(Math.random() * arr.length)] as T
}
