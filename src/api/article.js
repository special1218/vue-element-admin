import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/user/listByPage',
    method: 'get',
    params: query
  })
}

export function DeleteUser(data) {
  return request({
    url: '/user/delete',
    method: 'post',
    data
  })
}

export function AddUser(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data
  })
}

export function UpdateUser(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}

export function listByPage(query) {
  return request({
    url: '/shopping/listByPage',
    method: 'get',
    params: query
  })
}

