import request from '@/utils/request'
export default{
// 商品基础属性接口 : Base Manage ControllerShow/HideList OperationsExpand Operations
// GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
// attrInfoList
// 获取三级分类选中之后的属性列表
getList(category1Id,category2Id,category3Id){
    return request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
},

// DELETE /admin/product/deleteAttr/{attrId}
// deleteAttr
delete(attrId){
    return request.delete(`/admin/product/deleteAttr/${attrId}`)
},

// POST /admin/product/saveAttrInfo
// saveAttrInfo
addOrUpdate(attr){
    return request.post(`/admin/product/saveAttrInfo`,attr)
}

}
