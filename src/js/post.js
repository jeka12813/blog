class Post {
  constructor (containerElement) {
    this.containerElement = containerElement
    this.init()
  }

  init () {
    window.addEventListener('post.clicked', this.handlePostClicked.bind(this))
  }

  handlePostClicked ({
    detail
  }) {
    const {
      data
    } = detail
    this.render(data)
  }

  buildTemplate (data) {
    let date = new Date(data.createdAt)
    date = this.buildDate(date)
    let type = data.select
    type = this.buildTypePost(type)
    console.log(data)
    return `
    <div class="island__item" data-id="${data.id}">
    <h4>${data.title}</h4>
    <h3>${data.author}</h3>
    <p>${data.content}</p>
    <p>${type}</p>
    <time class="text-muted">${date}</time>
    </div>
    `
  }

  buildDate (data) {
    const dateCreate = this.transformTime(data.getDate())
    const monthCreate = this.transformTime(data.getMonth() + 1)
    const yearCreate = data.getFullYear()
    return `${dateCreate}.${monthCreate}.${yearCreate}`
  }

  transformTime (time) {
    return time < 10 ? `0${time}` : time
  }

  buildTypePost (type) {
    switch (type) {
      case '1':
        type = 'Бизнес'
        break
      case '2':
        type = 'Спорт'
        break
      case '3':
        type = 'Экономика'
        break
    }
    return type
  }

  render (data) {
    const template = this.buildTemplate(data)
    this.containerElement.innerHTML = template
  }
}

export {
  Post
}
