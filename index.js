'use strict'

import edgarFact from 'edgar-facts'

const promisify = (fn) =>
  (arg) =>
    new Promise((resolve, reject) =>
      fn(arg, (err, res) =>
        err ? reject(err) : resolve(res)))

export async function handler ({
  request,
  lxMessage: {
    message: {
      userId,
      contents: {
        conversationId,
        spaceId,
        timestamp,
        text,
        type
      }
    }
  }
}) {
  request = promisify(request)
  const fact = edgarFact()

  try {
    return await sendFact()
  } catch (err) {
    if (err.statusCode === 403 || err.statusCode === 500) {
      try {
        await joinSpace()
        return await sendFact()
      } catch (e) {
        console.warn('Unable to join space or provide Edgar fact', err)
      }
    } else {
      console.warn('Unable to provide Edgar fact', err)
    }
    return fact
  }

  function sendFact () {
    return request({
      method: 'POST',
      path: `/v1/spaces/${spaceId}/conversations/${conversationId}/posts`,
      body: {
        text: `Hey <@${userId}>! ${fact}.`,
        type: 'message'
      }
    })
  }

  function joinSpace () {
    return request({
      method: 'POST',
      path: `/v1/spaces/${spaceId}/members`,
      body: ['me']
    })
  }
}
