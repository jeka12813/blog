import { nanoid } from 'nanoid'
import { Modal } from 'bootstrap'
import { resetForm } from './helpers'

class Form {
  constructor (formElement) {
    this.buttonCreateModal = document.querySelector('#buttonCreate')
    this.formElement = formElement
    this.baseUrl = '/api/posts'
    this.instanceModal = Modal.getOrCreateInstance(document.querySelector('#formModal'))
    this.init()
    this.reEditing = ''
  }

  init () {
    this.formElement.addEventListener('submit', this.handleFormSubmit.bind(this))
    window.addEventListener('click.postForm.edit', this.handlePostEdit.bind(this))
    this.buttonCreateModal.addEventListener('click', this.clickbuttonCreateModal.bind(this))
  }

  handlePostEdit (event) {
    this.instanceModal.show()
    this.formElement.setAttribute('data-method', 'PUT')
    const { data } = event.detail

    if (data.id == this.reEditing.id) {
      for (const key in this.reEditing) {
        this.formElement.querySelector(`[name="${key}"]`).value = this.reEditing[key]
      }
    } else {
      for (const key in data) {
        this.formElement.querySelector(`[name="${key}"]`).value = data[key]
      }
    }
  }

  clickbuttonCreateModal () {
    resetForm(this.formElement)
    this.formElement.setAttribute('data-method', 'POST')
    this.instanceModal.show()
  }

  buildDate (data) {
    const dateCreate = this.transformTime(data.getDate())
    const monthCreate = this.transformTime(data.getMonth() + 1)
    const yearCreate = data.getFullYear()
    return `${dateCreate}.${monthCreate}.${yearCreate}`
  }

  handleFormSubmit (event) {
    event.preventDefault()
    let data = new Date()
    data = this.buildDate(data)

    const post = {
      id: nanoid(),
      createdAt: data
    }

    const formData = new FormData(this.formElement)

    for (const [name, value] of formData) {
      if (value) {
        post[name] = value
      }
    }

    this.sendData(post)
    this.instanceModal.hide()
    resetForm(this.formElement)
  }

  async sendData (post) {
    const json = JSON.stringify(post)
    const { method } = this.formElement.dataset
    let url = this.baseUrl
    if (method == 'PUT') {
      this.reEditing = post
      url = `${url}/${post.id}`
      const customEvent = new CustomEvent('form.edited', {
        detail: { post }
      })
      window.dispatchEvent(customEvent)
    }

    const response = await fetch(url, {
      method,
      body: json,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    const event = new CustomEvent('form.sent', {
      detail: { data }
    })
    window.dispatchEvent(event)
  }

  transformTime (time) {
    return time < 10 ? `0${time}` : time
  }
}

export { Form }
