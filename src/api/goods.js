import request from '@/utils/request'

export function listByPage(query) {
  return request({
    url: '/shopping/listByPage',
    method: 'get',
    params: query
  })
}

export function getModelById(query) {
  return request({
    url: '/goods/getModelById',
    method: 'get',
    params: query
  })
}

export function DeleteGoods(data) {
  return request({
    url: '/goods/delete',
    method: 'post',
    data
  })
}

export function AddGoods(data) {
  return request({
    url: '/goods/add',
    method: 'post',
    data
  })
}

export function UpdateGoods(data) {
  return request({
    url: '/goods/update',
    method: 'post',
    data
  })
}
