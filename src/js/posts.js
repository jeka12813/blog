class Posts {
  constructor (containerElement) {
    this.containerElement = containerElement
    this.baseUrl = '/api/posts'
    this.init()
  }

  init () {
    this.containerElement.addEventListener('click', this.handlePostSend.bind(this))
    document.addEventListener('DOMContentLoaded', this.handlDOMReady.bind(this))
    window.addEventListener('form.sent', this.handleDataSent.bind(this))
  }

  handlePostSend (event) {
    const { target } = event
    const { id } = target.dataset
    if (target.dataset.role !== 'edit') return
    fetch(`${this.baseUrl}/${id} `)
      .then(response => response.json())
      .then(data => {
        const eventCustom = new CustomEvent('post.clicked', {
          detail: { data }
        })
        window.dispatchEvent(eventCustom)
      })
  }

  handlDOMReady () {
    fetch(this.baseUrl)
      .then(response => response.json())
      .then(data => {
        const { list } = data
        this.render(list)
      })
  }

  handleDataSent ({ detail }) {
    const { data } = detail

    this.render(data.list)
  }

  buildTemplate (data) {
    return `
    <div class="island__item"  data-role="edit" color="red" data-id="${data.id}">
    <h4>${data.title}</h4>
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
