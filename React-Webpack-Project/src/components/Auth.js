class Auth {
  constructor() {
  }
  login(cb) {
    localStorage.setItem('isLoggedIn', true)
    cb();
  }

  logout(cb) {
    localStorage.removeItem('isLoggedIn')
    cb();
  }
  // logout(cb) {
  //   localStorage.setItem('isLoggedIn', false)
  //   cb();
  // }
}
export default new Auth();