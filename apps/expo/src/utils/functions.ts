export const getRandomChoice = <T extends unknown>(arr: T[]) => {
  return arr[Math.floor(Math.random() * arr.length)] as T
}
