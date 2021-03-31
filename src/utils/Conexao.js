import axios from 'axios'
import Guids from './GuidEmpresas.js'
var protocolo = location.protocol
var portaHttp = 5000
var portaHttps = 5001

var url = protocolo + '//localhost:'
if (protocolo === 'http:') {
  url = url + portaHttp + '/api/'
} else if (protocolo === 'https:') {
  url = url + portaHttps + '/api/'
}

export function preparaConexao () {
  return new Promise(resolve => {
    axios.defaults.baseURL = url
    axios.defaults.headers.post['Content-Type'] = 'application/json'
    axios.defaults.headers.put['Content-Type'] = 'application/json'
    axios.defaults.headers.patch['Content-Type'] = 'application/json'
    axios.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem('token')
    Guids().then(res => {
      axios.defaults.headers.common['X-Empresa-Guid'] = res
    })
    resolve()
  })
}

export function Patch (rota, objeto) {
  return new Promise((resolve, reject) => {
    preparaConexao().then(() => {
      var json = JSON.stringify(objeto)
      axios.patch(url + rota, json).then((result) => {
        resolve(result)
      }).catch((err) => {
        reject(err)
      })
    })
  })
}

export function PatchComCabecalho (rota, objeto, cabecalho) {
  return new Promise((resolve, reject) => {
    preparaConexao().then(() => {
      var json = JSON.stringify(objeto)
      axios.patch(url + rota, json, 'Bearer ' + cabecalho).then((result) => {
        resolve(result)
      }).catch((err) => {
        reject(err)
      })
    })
  })
}

export function Post (rota, objeto) {
  return new Promise((resolve, reject) => {
    preparaConexao().then(() => {
      var json = JSON.stringify(objeto)
      axios.post(url + rota, json).then((result) => {
        resolve(result)
      }).catch((err) => {
        reject(err)
      })
    })
  })
}

export function Get (rota) {
  return new Promise((resolve, reject) => {
    preparaConexao().then(() => {
      axios.get(url + rota).then((result) => {
        resolve(result)
      }).catch((err) => {
        reject(err)
      })
    })
  })
}

export function Delete (rota) {
  return new Promise((resolve, reject) => {
    preparaConexao().then(() => {
      axios.delete(url + rota).then((result) => {
        resolve(result)
      }).catch((err) => {
        reject(err)
      })
    })
  })
}

export function Put (rota, objeto) {
  return new Promise((resolve, reject) => {
    preparaConexao().then(() => {
      var json = JSON.stringify(objeto)
      axios.put(url + rota, json).then((result) => {
        resolve(result)
      }).catch((err) => {
        reject(err)
      })
    })
  })
}

export function PutSemObjecto(rota) {
  return new Promise((resolve, reject) => {
    preparaConexao().then(() => {
      axios.put(url + rota).then((result) => {
        resolve(result)
      }).catch(err => {
        reject(err)
      })
    })
  })
}