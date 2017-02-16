'use strict'

import edgarFact from 'edgar-facts'

export function handler ({
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
}, cb) {
  request({
    method: 'POST',
    path: `/v1/spaces/${spaceId}/conversations/${conversationId}/posts`,
    body: {
      text: `Hey <@${userId}>! ${edgarFact()}`,
      type: 'message'
    }
  }, cb)
}
