/**
 * 包含所有sku管理的接口请求函数
 */

 import request from '@/utils/request' 
 export default{
     /**
      * 商品SKU接口 : Sku Manage ControllerShow/HideList OperationsExpand Operations
      * GET /admin/product/cancelSale/{skuId}
      * cancelSale
      */
    //  下架SKU
    cancelSale(skuId){
        return request.get(`/admin/product/cancelSale/${skuId}`)
    },

    /**
     * GET /admin/product/onSale/{skuId}
     * onSale
     */
    // 上架SKU
    onSale(skuId){
        return request.get(`/admin/product/onSale/${skuId}`)
    },

    /**
     * DELETE /admin/product/deleteSku/{skuId}
     * deleteSku
     */
    // 删除指定id的sku
    remove(skuId){
        return request.delete(`/admin/product/deleteSku/${skuId}`)
    },
    
    /**
     * GET /admin/product/findBySpuId/{spuId}
     * findBySpuId
     */
    //根据指定的SPU的id查询所有对应的SKU的列表
    getListBySpuId(spuId){
        return request.get(`/admin/product/findBySpuId/${spuId}`)
    },

    /**
     * GET /admin/product/getSkuById/{skuId}
     * getById
     */
    get(skuId){
        return request.get(`/admin/product/getSkuById/${skuId}`)
    },

    /**
     * GET /admin/product/list/{page}/{limit}
     * index
     */
    //获取SKU的分页列表
    getList(page,limit){
        return request.get(`/admin/product/list/${page}/${limit}`)
    },

    /**
     * 保存SKU
     * POST /admin/product/saveSkuInfo
     * saveSkuInfo
     * 
     * POST /admin/product/updateSkuInfo
     * updateSkuInfo
     */
    addUpdate(skuInfo){
        return request.post(`/admin/product/${skuInfo ? 'update' : 'save'}SkuInfo`,skuInfo)
    },

    /**
     * 获取指定SPU的id对应的图片列表
     * GET /admin/product/spuImageList/{spuId}
     * getSpuImageList
     */
    getSpuImageList(spuId){
        return request.get(`/admin/product/spuImageList/${spuId}`)
    },

    /**
     * GET /admin/product/spuSaleAttrList/{spuId}
     * getSpuSaleAttrList
     */
    getSpuSaleAttrList(spuId){
        return request.get(`/admin/product/spuSaleAttrList/${spuId}`)
    }

 }




















