import request from '@/utils/request'

export function ListBanner(query) {
  return request({
    url: '/banner/list',
    method: 'get',
    params: query
  })
}

export function getModelById(query) {
  return request({
    url: '/banner/getModelById',
    method: 'get',
    params: query
  })
}

export function AddBanner(data) {
  return request({
    url: '/banner/add',
    method: 'post',
    data
  })
}

export function DeleteBanner(data) {
  return request({
    url: '/banner/delete',
    method: 'post',
    data
  })
}

export function UpdateBanner(data) {
  return request({
    url: '/banner/update',
    method: 'post',
    data
  })
}

