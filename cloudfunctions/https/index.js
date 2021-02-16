// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({event})
  const _ = db.command
  // 批量删除图片
  app.router('bacthDeleteImgs', async ctx=>{
    let res = db.collection('images').where({
      // fileId: event.fileIds[0]
      fileId: _.in(event.fileIds)
    }).remove()
    ctx.body = res
  })

  return app.serve()
}

