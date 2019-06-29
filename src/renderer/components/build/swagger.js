import axios from 'axios'

const template = require('template_js');

const fs = require('fs');

const swagger = function(){
  return this
}

swagger.prototype.load=function(path='http://192.168.124.254:8091/v2/api-docs?group=Default',basePath){
  let self = this
  return new Promise((resolve, reject)=>{
    axios.get(path).then(res=>{
      let obj = self.analysis(res.data,basePath)
      //var html = template(__dirname + '/template.art',obj)
      fs.readFile(__dirname + '/template.art','utf8',function(err,data){
        if(err){
          return false
        }
        self.build(data,obj)
      })
      resolve(obj)
    })
  })
}

swagger.prototype.build=function(data,obj){
  let arr = obj.data;
  Object.keys(arr).forEach(key=>{
    let item = arr[key]
    let options = Object.assign({},obj,{pageData:item})
    var html = template(data,{obj:options})
    console.log(html,options)
  })
}

swagger.prototype.analysis=function(data,bp){
  let {swagger,info,host,basePath,tags,paths,definitions} = data
  let result = {}
  Object.keys(paths).forEach(key=>{
    let obj = paths[key]
    let funName = url2FunName(key)
    //如果接口支持多种请求方式 则只生成一种(第一种)
    let method = Object.keys(obj)[0] 
    let item = obj[method]
    //分组
    let {name,tag,description:des} = grouping(item,tags,key)
    //解析数据
    let {parameters,responses,summary,description,operationId,consumes,produces} = item
    let ap = analysisParameters(parameters,definitions) //JSON
    let ar = analysisResponses(responses,definitions) //JSON
    let data = []
    if(result.hasOwnProperty(name)){
      data = result[name]
    }
    data.push({
      parameters:ap,
      responses:ar,
      tag:tag,
      tagDescription:des,
      method:method,
      funName:funName,
      summary:summary,
      description:description,
      operationId:operationId,
      consumes:consumes,
      produces:produces,
      url:key
    })
    result[name] = data
  })
  return {
    swagger:swagger,
    info:info,
    host:host,
    basePath:bp,
    data:result
  }
}

/**
 * url 转方法名称 首字母大写
 * @param {*} url 
 */
function url2FunName(url){
  let arr = [],index=0
  url.split('/').forEach((item)=>{
    if(item !== ''){
      if(index === 0){
        item = item.replace(item[0],item[0].toLowerCase())  
      }else{
        item = item.replace(item[0],item[0].toUpperCase())
      }
      arr.push(item)
      index++
    }
  })
  return arr.join('')
}
/**
 * 解析definitions
 * @param {*} ref 
 * @param {*} definitions 
 */
function analysisSchema(ref,definitions,isParams=false){
  let result = {}
  let key = ref.split('/')
  key = key[key.length-1]
  let obj = definitions[key]
  let properties = obj.properties
  Object.keys(properties).forEach(o=>{
    let item = properties[o]
    let isLast = true
    if(item.hasOwnProperty('schema')){
      let schema = item.schema
      if(schema.hasOwnProperty('$ref')){
        isLast = false
        let res = analysisSchema(schema.$ref,definitions,isParams)
        result[o] = Object.assign(res,{__:true})
      }
    }
    if(isLast){
      result[o] = item
    }
  })
  return result
}
/**
 * 解析请求参数
 * @param {*} parameters 
 * @param {*} definitions 
 */
function analysisParameters(parameters,definitions){
  let result = {}
  parameters.forEach(item=>{
    let {name,in:$in,description,required=false,type,default:dv='',schema} = item
    let data = {}
    if(result.hasOwnProperty($in)){
      data = result[$in]
    }
    if(typeof schema !== 'undefined'){
      let refs = schema.$ref
      data = analysisSchema(refs,definitions,true)
    }else{
      data[name] = item
    }
    result[$in] = data
  })
  return result
}
/**
 * 解析返回参数
 * @param {*} responses 
 * @param {*} definitions 
 */
function analysisResponses(responses,definitions){
  let data = responses["200"]
  let ref = data.schema.$ref
  return analysisSchema(ref,definitions,false)
}
/**
 * 分组
 * @param {*} url 
 */
function grouping(obj,tags,url){
  let tag = obj.tags[0]
  let data =  url.split('/')
  let name=''
  for(let i in data){
    let str = data[i]
    if(str !== ''){
      name = str
      break
    }
  }
  let des = ''
  for(let i in tags){
    let {name,description} = tags[i]
    if(name === tag){
      des = description
      break
    }
  }
  return  {name:name,description:des,tag:tag}
}

export default new swagger()