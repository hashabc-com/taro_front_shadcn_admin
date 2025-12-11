import { useEffect, useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { type Role, type TreeNode } from '../schema'
import { createRole, updateRole, getResourceList } from '@/api/role'
import { format } from 'date-fns'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

// 表单验证Schema
const roleFormSchema = z.object({
  role: z.string().min(1, '请输入角色名'),
  description: z.string().optional(),
  resourceIds: z.array(z.number()).min(1, '请至少选择一个模块'),
})

type RoleFormValues = z.infer<typeof roleFormSchema>

type RoleEditDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: Role | null
  isAdd: boolean
}

// 树形节点组件
function TreeNodeComponent({
  node,
  selectedIds,
  onToggle,
  expandedIds,
  onExpand,
}: {
  node: TreeNode
  selectedIds: number[]
  onToggle: (id: number) => void
  expandedIds: Set<string>
  onExpand: (key: string) => void
}) {
  const hasChildren = node.children && node.children.length > 0
  const isExpanded = expandedIds.has(node.key)
  const isChecked = node.id ? selectedIds.includes(node.id) : false

  // 判断是否部分选中(有子节点被选中但不是全部)
  const isIndeterminate = useMemo(() => {
    if (!hasChildren || !node.id) return false
    const childIds = node.children!.map((c) => c.id).filter((id): id is number => id !== undefined)
    const selectedChildCount = childIds.filter((id) => selectedIds.includes(id)).length
    // 父节点未选中，但有子节点选中时显示为部分选中
    return !selectedIds.includes(node.id) && selectedChildCount > 0
  }, [hasChildren, node.children, node.id, selectedIds])

  // 递归获取所有子节点的id
  const getAllChildIds = (node: TreeNode): number[] => {
    if (!node.children) return []
    const ids: number[] = []
    node.children.forEach((child) => {
      if (child.id) ids.push(child.id)
      ids.push(...getAllChildIds(child))
    })
    return ids
  }

  const handleParentToggle = () => {
    if (!node.id) return // 没有id的节点不允许操作

    if (hasChildren) {
      // 获取所有子节点的id
      const allChildIds = getAllChildIds(node)
      const isCurrentChecked = selectedIds.includes(node.id)
      
      // 切换父节点自身
      onToggle(node.id)
      
      // 如果父节点当前是选中状态，取消所有子节点；否则选中所有子节点
      allChildIds.forEach((childId) => {
        const isChildSelected = selectedIds.includes(childId)
        if (isCurrentChecked) {
          // 父节点被取消，取消所有子节点
          if (isChildSelected) {
            onToggle(childId)
          }
        } else {
          // 父节点被选中，选中所有子节点
          if (!isChildSelected) {
            onToggle(childId)
          }
        }
      })
    } else {
      // 没有子节点，直接切换
      onToggle(node.id)
    }
  }

  return (
    <div className='select-none'>
      <div className='flex items-center gap-1 py-1 hover:bg-accent rounded-sm'>
        {hasChildren ? (
          <Button
            variant='ghost'
            size='sm'
            className='h-6 w-6 p-0'
            onClick={() => onExpand(node.key)}
          >
            {isExpanded ? (
              <ChevronDown className='h-4 w-4' />
            ) : (
              <ChevronRight className='h-4 w-4' />
            )}
          </Button>
        ) : (
          <span className='w-6' />
        )}
        <div className='flex items-center flex-1 gap-2'>
          <Checkbox
            checked={isChecked}
            disabled={!node.id}
            onCheckedChange={() => handleParentToggle()}
            className={cn(isIndeterminate && 'data-[state=checked]:bg-primary/50')}
          />
          <label
            onClick={() => handleParentToggle()}
            className={cn(
              'flex items-center gap-1.5 text-sm',
              node.id ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
            )}
          >
            {/* {hasChildren && <FolderTree className='h-4 w-4' />} */}
            {node.title}
          </label>
        </div>
      </div>
      {hasChildren && isExpanded && (
        <div className='ml-6 border-l pl-2'>
          {node.children!.map((child) => (
            <TreeNodeComponent
              key={child.key}
              node={child}
              selectedIds={selectedIds}
              onToggle={onToggle}
              expandedIds={expandedIds}
              onExpand={onExpand}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function RoleEditDialog({ open, onOpenChange, role, isAdd }: RoleEditDialogProps) {
  const queryClient = useQueryClient()
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      role: '',
      description: '',
      resourceIds: [],
    },
  })

  // 监听 form 值变化并同步到 selectedIds
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.resourceIds) {
        setSelectedIds(value.resourceIds as number[])
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  // 获取资源列表
  const { data: resourceData } = useQuery({
    queryKey: ['resources'],
    queryFn: async () => {
      const response = await getResourceList()
      return response.result
    },
  })

  // 直接根据resourceList构建树形结构
  const treeData: TreeNode[] = useMemo(() => {
    if (!resourceData?.resourceList) return []
    
    const resources = resourceData.resourceList
    
    // 构建父子关系映射
    const parentMap = new Map<number | undefined, typeof resources>()
    resources.forEach((resource) => {
      const parentId = resource.parentId
      if (!parentMap.has(parentId)) {
        parentMap.set(parentId, [])
      }
      parentMap.get(parentId)!.push(resource)
    })
    
    // 递归构建树形结构
    const buildTree = (parentId: number | undefined): TreeNode[] => {
      const children = parentMap.get(parentId) || []
      return children.map((resource) => {
        const childNodes = buildTree(resource.id)
        return {
          id: resource.id,
          key: resource.id?.toString() || resource.name || '',
          title: resource.name || '',
          children: childNodes.length > 0 ? childNodes : undefined,
        }
      })
    }
    
    // 从根节点(parentId为undefined或0)开始构建
    const tree = buildTree(undefined)
    if (tree.length === 0) {
      // 如果没有找到根节点，尝试parentId为0
      return buildTree(0)
    }
    
    console.log('Tree Data from resourceList:', tree)
    return tree
  }, [resourceData])

  // 构建资源id到资源对象的映射
  const resourceMap = useMemo(() => {
    if (!resourceData?.resourceList) return new Map()
    return new Map(resourceData.resourceList.map(r => [r.id, r]))
  }, [resourceData])

  // 初始化表单数据
  useEffect(() => {
    if (open && role && !isAdd) {
      const resourceIds = role.resourceIds
        .split(',')
        .filter((id) => id)
        .map((id) => parseInt(id))

      form.reset({
        role: role.role,
        description: role.description,
        resourceIds,
      })
      setSelectedIds(resourceIds)

      // 展开所有有选中子节点的父节点
      const expandedKeys = new Set<string>()
      treeData.forEach((parent) => {
        if (parent.children?.some((child) => child.id && resourceIds.includes(child.id))) {
          expandedKeys.add(parent.key)
        }
      })
      setExpandedIds(expandedKeys)
    } else if (open && isAdd) {
      form.reset({
        role: '',
        description: '',
        resourceIds: [],
      })
      setSelectedIds([])
      setExpandedIds(new Set())
    }
  }, [open, role, isAdd, form, treeData])

  const mutation = useMutation({
    mutationFn: (data: RoleFormValues) => {
      const payload = {
        role: data.role,
        description: data.description || '',
        resourceIds: data.resourceIds.join(','),
        ...(isAdd
          ? { createTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss') }
          : { id: role!.id }),
      }
      return isAdd ? createRole(payload as never) : updateRole(payload as never)
    },
    onSuccess: (res) => {
      if(res.code == 200){
        queryClient.invalidateQueries({ queryKey: ['roles'] })
       toast.success(isAdd ? '添加成功' : '更新成功')
      }else{
        toast.error(res.message || '操作失败')
      }
      handleClose()
    },
    onError: (error: unknown) => {
      toast.error((error as Error).message || '操作失败')
    },
  })

  const onSubmit = (data: RoleFormValues) => {
    mutation.mutate(data)
  }

  const handleClose = () => {
    form.reset()
    setExpandedIds(new Set())
    onOpenChange(false)
  }

  const handleToggleId = (id: number) => {
    const currentIds = form.getValues('resourceIds')
    const isRemoving = currentIds.includes(id)
    
    let newIds: number[]
    if (isRemoving) {
      // 取消选中
      newIds = currentIds.filter((i) => i !== id)
    } else {
      // 选中
      newIds = [...currentIds, id]
    }
    
    // 检查是否需要自动选中或取消父级
    const resource = resourceMap.get(id)
    if (resource?.parentId) {
      const parentId = resource.parentId
      // 获取父级的所有子节点
      const siblingIds = resourceData?.resourceList
        ?.filter(r => r.parentId === parentId && r.id)
        .map(r => r.id!) || []
      
      if (isRemoving) {
        // 取消子节点时，如果父级被选中，也取消父级
        if (newIds.includes(parentId)) {
          newIds = newIds.filter(i => i !== parentId)
        }
      } else {
        // 选中子节点时，检查是否所有兄弟节点都被选中
        const allSiblingsSelected = siblingIds.every(sibId => newIds.includes(sibId))
        if (allSiblingsSelected && !newIds.includes(parentId)) {
          // 所有子节点都被选中，自动选中父级
          newIds = [...newIds, parentId]
        }
      }
    }
    
    // 使用 setValue 并触发验证
    form.setValue('resourceIds', newIds, { shouldValidate: true })
  }

  const handleExpand = (key: string) => {
    const newExpanded = new Set(expandedIds)
    if (newExpanded.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
    }
    setExpandedIds(newExpanded)
  }

  const handleSelectAll = () => {
    const allIds = treeData.flatMap((parent) => [
      parent.id,
      ...(parent.children?.map((child) => child.id) || []),
    ]).filter((id): id is number => id !== undefined)
    form.setValue('resourceIds', allIds)
    // 展开所有节点
    setExpandedIds(new Set(treeData.map((node) => node.key)))
  }

  const handleClearAll = () => {
    form.setValue('resourceIds', [])
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className='sm:max-w-[600px] overflow-y-auto'>
        <SheetHeader>
          <SheetTitle>{isAdd ? '添加角色' : '编辑角色'}</SheetTitle>
          <SheetDescription>
            {isAdd ? '创建新的角色并分配权限' : '修改角色信息和权限'}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 p-4'>
            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>角色名</FormLabel>
                  <FormControl>
                    <Input placeholder='请输入角色名' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>描述</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='请输入角色描述'
                      maxLength={150}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='resourceIds'
              render={() => (
                <FormItem>
                  <div className='flex items-center justify-between'>
                    <FormLabel>模块权限</FormLabel>
                    <div className='flex gap-2'>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={handleSelectAll}
                      >
                        全选
                      </Button>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={handleClearAll}
                      >
                        清空
                      </Button>
                    </div>
                  </div>
                  {/* max-h-[300px] */}
                  <div className='border rounded-md p-3 overflow-y-auto'>
                    {treeData.map((node) => (
                      <TreeNodeComponent
                        key={node.key}
                        node={node}
                        selectedIds={selectedIds}
                        onToggle={handleToggleId}
                        expandedIds={expandedIds}
                        onExpand={handleExpand}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className='mt-auto'>
              <Button type='submit' disabled={mutation.isPending}>
                {mutation.isPending ? '提交中...' : '确定'}
              </Button>
              <Button type='button' variant='outline' onClick={handleClose}>
                取消
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
