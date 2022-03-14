class Posts {
  constructor (containerElement) {
    this.containerElement = containerElement
    this.baseUrl = '/api/posts'
    this.activePost = null
    this.postId = ''
    this.currentPost = {}
    this.sortData = ''
    this.inputElement = document.querySelector('#inputSearch')
    this.init()
  }

  init () {
    this.containerElement.addEventListener('click', this.handlePostSend.bind(this))
    document.addEventListener('DOMContentLoaded', this.handlDOMReady.bind(this))
    window.addEventListener('form.sent', this.handleDataSent.bind(this))
    window.addEventListener('click.del', this.postDelClicked.bind(this))
    window.addEventListener('click.post.edit', this.clickPostEdit.bind(this))
    this.inputElement.addEventListener('input', this.handlePostSort.bind(this))
  }

  handlePostSort (event) {
    const { target } = event
    const search = target.value
    const consilience = this.sortData.filter((item) => item.title.includes(search))
    this.render(consilience)
  }

  clickPostEdit () {
    const postEdit = new CustomEvent('click.postForm.edit', {
      detail: { data: this.currentPost }
    })
    window.dispatchEvent(postEdit)
  }

  async postDelClicked () {
    const response = await fetch(this.postId, {
      method: 'DELETE'
    })
    const data = await response.json()

    this.render(data.list)
  }

  async handlePostSend (event) {
    const { target } = event
    const { id } = target.dataset
    if (target.dataset.role !== 'edit') return
    const listItemElement = target.closest('.island__item')
    if (listItemElement) {
      if (this.activePost) {
        this.activePost.classList.remove('island__item_active')
      }
      listItemElement.classList.add('island__item_active')
      this.activePost = listItemElement
    }
    const response = await fetch(`${this.baseUrl}/${id} `)
    const data = await response.json()
    this.currentPost = data
    const eventCustom = new CustomEvent('post.clicked', {
      detail: { data }
    })
    this.postId = `${this.baseUrl}/${id} `
    window.dispatchEvent(eventCustom)
  }

  async handlDOMReady () {
    const response = await fetch(this.baseUrl)
    const data = await response.json()

    const { list } = data
    this.render(list)
  }

  handleDataSent ({ detail }) {
    const { data } = detail
    this.sortData = data.list
    this.render(data.list)
  }

  buildTemplate (data) {
    return `
    <div class="island__item"  data-role="edit" color="red" data-id="${data.id}">
    <h4>${data.title}</h4>
    <h4>${data.createdAt}</h4>
    </div>
    `
  }

  render (data) {
    const templates = data.map(item => {
      return this.buildTemplate(item)
    })
    this.containerElement.innerHTML = templates.join('')
  }
}
export { Posts }
