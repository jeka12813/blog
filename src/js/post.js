class Post {
  constructor (containerElement) {
    this.containerElement = containerElement
    this.init()
  }

  init () {
    window.addEventListener('post.clicked', this.handlePostClicked.bind(this))
    this.containerElement.addEventListener('click', this.removePosts.bind(this))
    this.containerElement.addEventListener('click', this.editPosts.bind(this))
    window.addEventListener('form.edited', this.handleFormEdited.bind(this))
  }

  handleFormEdited ({ detail }) {
    this.render(detail.post)
  }

  removePosts (event) {
    const { role } = event.target.dataset
    if (role == 'remove') {
      this.containerElement.innerHTML = ''

      const customEvent = new CustomEvent('click.del', {
        detail: {}
      })
      window.dispatchEvent(customEvent)
    }
  }

  editPosts (event) {
    const { role } = event.target.dataset
    if (role == 'edit') {
      const postEdit = new CustomEvent('click.post.edit', {
        detail: {}
      })
      window.dispatchEvent(postEdit)
    }
  }

  handlePostClicked ({ detail }) {
    const { data } = detail
    this.render(data)
  }

  buildTypePost (type) {
    switch (type) {
      case '0':
        type = 'НЕ ВЫБРАННО'
        break
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

  buildTemplate (data) {
    let type = data.select
    type = this.buildTypePost(type)
    return `
      <div class="island__item" data-id="${data.id}">
        <h4>${data.title}</h4>
        <h3>${data.author}</h3>
        <p>${data.content}</p>
        <p>${type}</p>
        <time class="text-muted">${data.createdAt}</time>
        <div class="mt-t">
           <buttom class="btn btn-warning" data-role="edit">Редактирование</buttom>
           <buttom class="btn btn-danger" data-role="remove">Удалить</buttom>
        </div>
      </div>
      `
  }

  render (data) {
    const template = this.buildTemplate(data)
    this.containerElement.innerHTML = template
  }
}

export {
  Post
}
