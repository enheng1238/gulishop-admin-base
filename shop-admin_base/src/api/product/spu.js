/** 
 * 包含所有SPU管理的接口请求函数
 */
import request from '@/utils/request'
import { get } from 'js-cookie'
import { remove } from 'nprogress'

export default {
    /**
     * 获取所有销售属性列表
     * GET /admin/product/baseSaleAttrList
     * getBaseSaleAttrList
     * 
     *  "data": [
            {
            "id": 1,
            "name": "选择颜色"
            },
        ],
        
     */

    //  所有的销售属性列表
    // 一个spu有自己的销售属性列表 它的销售属性列表是从所有的销售属性列表当中选择的几个或者全部

    getSaleList(){
        return request.get('/admin/product/baseSaleAttrList')
    },

    /**
     * DELETE /admin/product/deleteSpu/{spuId}
     * deleteSpu
    */

    // 删除指定id的SPU
    remove(id){
        return request.delete(`/admin/product/deleteSpu/${spuId}`)
    },

    /** 
     * GET 
     * 获取spu基本信息
     */

     //指定id的SPU信息(获取某一个spu详情)
     get(id){
         return request.get(`/admin/product/getSpuById/${id}`)
     },
     
     /** 
      * POST /admin/product/saveSpuInfo
      * saveSpuInfo
      * POST /admin/product/updateSpuInfo
      * 更改spu信息
      * */
    //  保存(添加/更新)SPU
     addUpdate(spuInfo){
        return request.post(`/admin/product/${spuInfo.id} ? 'u[date' : 'save' SpuInfo`,spuInfo)
     },

     /** 
      * GET /admin/product/{page}/{limit}
      * index
      */
    //  获取指定分类的SPU分页列表
     getList(page,limit,category3Id){
         return request.get(`/admin/product/${page}/${limit}`,{params:{category3Id}})
     }

}








