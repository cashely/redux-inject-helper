const mockSleep = (time) => {
  return new Promise(resolve => {
    setTimeout(resolve, time * 1000)
  })
}

const store = {
  name: 'app',
  state: {
    count: 0,
    ecount: 2,
  },
  reducers: {
    add(num) {
      this.state.count += num
    },
    async asyncAdd(num) {
      await mockSleep(2);
      this.state.ecount += num
    }
  }
}

export default store