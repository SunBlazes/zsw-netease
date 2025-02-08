const debounce = (fn: Function, delay = 100) => {
  let timer: NodeJS.Timeout
  return (...args: any[]) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => fn(...args), delay)
  }
}

export default debounce
