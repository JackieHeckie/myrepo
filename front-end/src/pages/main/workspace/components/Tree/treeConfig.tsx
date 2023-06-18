import { ITreeNode } from '@/typings/tree';
import { TreeNodeType } from '@/constants/tree';
import connectionService from '@/service/connection';
import mysqlServer, { ISchemaParams, IGetListParams, ITableParams } from '@/service/mysql';


export type ITreeConfig = Partial<{ [key in TreeNodeType]: ITreeConfigItem }>;

export const switchIcon: Partial<{ [key in TreeNodeType]: { icon: string } }> = {
  [TreeNodeType.DATABASE]: {
    icon: '\ue62c'
  },
  [TreeNodeType.SCHEMAS]: {
    icon: '\ue696'
  },
  [TreeNodeType.TABLE]: {
    icon: '\ue63e'
  },
  [TreeNodeType.TABLES]: {
    icon: '\ueac5'
  },
  [TreeNodeType.COLUMNS]: {
    icon: '\ueac5'
  },
  [TreeNodeType.COLUMN]: {
    icon: '\ue611'
  },
  [TreeNodeType.KEYS]: {
    icon: '\ueac5'
  },
  [TreeNodeType.KEY]: {
    icon: '\ue775'
  },
  [TreeNodeType.INDEXES]: {
    icon: '\ueac5'
  },
  [TreeNodeType.INDEX]: {
    icon: '\ue65b'
  },
}

export enum OperationColumn {
  REFRESH = 'refresh',
  ShiftOut = 'shiftOut',
  CreateTable = 'createTable',
  CreateConsole = 'createConsole',
  DeleteTable = 'deleteTable',
  ExportDDL = 'exportDDL',
  EditSource = 'editSource'
}

export interface ITreeConfigItem {
  icon?: string;
  getChildren?: (params: any) => Promise<ITreeNode[]>;
  next?: TreeNodeType;
  operationColumn?: OperationColumn[]
}

export const treeConfig: { [key in TreeNodeType]: ITreeConfigItem } = {
  [TreeNodeType.DATA_SOURCES]: {
    getChildren: () => {
      return new Promise((r: (value: ITreeNode[]) => void, j) => {
        let p = {
          pageNo: 1,
          pageSize: 999
        }

        connectionService.getList(p).then(res => {
          const data: ITreeNode[] = res.data.map(t => {
            return {
              key: t.id!,
              name: t.alias,
              nodeType: TreeNodeType.DATA_SOURCE,
            }
          })
          r(data);
        }).catch(error => {
          j()
        })
      })
    },
  },
  [TreeNodeType.DATA_SOURCE]: {
    getChildren: (params: { id: number }) => {
      return new Promise((r: (value: ITreeNode[]) => void, j) => {
        connectionService.getDBList(params).then(res => {
          const data: ITreeNode[] = res.map(t => {
            return {
              key: t.name,
              name: t.name,
              nodeType: TreeNodeType.DATABASE,
            }
          })
          r(data);
        }).catch(error => {
          j()
        })
      })
    },
    operationColumn: [
      OperationColumn.EditSource, OperationColumn.REFRESH, OperationColumn.ShiftOut
    ],
    next: TreeNodeType.DATABASE
  },
  [TreeNodeType.DATABASE]: {
    icon: '\ue62c',
    getChildren: (params: ISchemaParams) => {
      return new Promise((r: (value: ITreeNode[], b?: any) => void, j) => {
        mysqlServer.getSchemaList(params).then(res => {
          const data: ITreeNode[] = res.map(t => {
            return {
              key: t.name,
              name: t.name,
              nodeType: TreeNodeType.SCHEMAS,
              schemaName: t.name,
            }
          })
          r(data);
          // if (data.length) {
          // } else {
          //   let data = [
          //     {
          //       key: params.databaseName + 'tables',
          //       name: 'tables',
          //       nodeType: TreeNodeType.TABLES,
          //     }
          //   ]
          //   r(data, 'custom');
          // }
        }).catch(error => {
          j()
        })
      })
    },
    operationColumn: [
      OperationColumn.CreateConsole, OperationColumn.CreateTable, OperationColumn.REFRESH
    ],
    next: TreeNodeType.SCHEMAS
  },
  [TreeNodeType.SCHEMAS]: {
    icon: '\ue696',
    getChildren: (parentData: ITreeNode) => {
      return new Promise((r: (value: ITreeNode[]) => void, j) => {
        let data = [
          {
            key: parentData.name + 'tables',
            name: 'tables',
            nodeType: TreeNodeType.TABLES,
          }
        ]
        r(data);
      })
    },
    operationColumn: [
      OperationColumn.CreateConsole, OperationColumn.CreateTable, OperationColumn.REFRESH
    ],
  },
  [TreeNodeType.TABLES]: {
    icon: '\ueac5',
    getChildren: (params: IGetListParams) => {
      return new Promise((r: (value: ITreeNode[]) => void, j) => {
        let p = {
          dataSourceId: params.dataSourceId,
          databaseName: params.databaseName,
          schemaName: params.schemaName,
          pageNo: 1,
          pageSize: 999,
        }

        mysqlServer.getList(p).then(res => {
          const tableList: ITreeNode[] = res.data?.map((item: any) => {
            return {
              name: item.name,
              nodeType: TreeNodeType.TABLE,
              key: item.name,
            }
          })
          r(tableList);
        }).catch(error => {
          j()
        })
      })
    },
    operationColumn: [
      OperationColumn.CreateConsole, OperationColumn.CreateTable, OperationColumn.REFRESH
    ],
  },
  [TreeNodeType.TABLE]: {
    icon: '\ue63e',
    getChildren: () => {
      return new Promise((r: (value: ITreeNode[]) => void, j) => {
        const tableList = [
          {
            name: 'columns',
            nodeType: TreeNodeType.COLUMNS,
            key: 'columns',
          },
          {
            name: 'keys',
            nodeType: TreeNodeType.KEYS,
            key: 'keys',
          },
          {
            name: 'indexs',
            nodeType: TreeNodeType.INDEXES,
            key: 'indexs',
          },
        ]

        r(tableList);
      })
    },
    operationColumn: [
      OperationColumn.CreateConsole, OperationColumn.ExportDDL, OperationColumn.DeleteTable
    ],
  },
  [TreeNodeType.COLUMNS]: {
    icon: '\ueac5',
    getChildren: (params: ITableParams) => {
      return new Promise((r: (value: ITreeNode[]) => void, j) => {

        mysqlServer.getColumnList(params).then(res => {
          const tableList: ITreeNode[] = res?.map(item => {
            return {
              name: item.name,
              nodeType: TreeNodeType.COLUMN,
              key: item.name,
              isLeaf: true,
              columnType: item.columnType,
            }
          })
          r(tableList);
        }).catch(error => {
          j()
        })
      })
    }
  },
  [TreeNodeType.COLUMN]: {
    icon: '\ue611'
  },
  [TreeNodeType.KEYS]: {
    icon: '\ueac5',
    getChildren: (params: ITableParams) => {
      return new Promise((r: (value: ITreeNode[]) => void, j) => {

        mysqlServer.getKeyList(params).then(res => {
          console.log(res)
          const tableList: ITreeNode[] = res?.map(item => {
            return {
              name: item.name,
              nodeType: TreeNodeType.KEY,
              key: item.name,
              isLeaf: true,
            }
          })
          r(tableList);
        }).catch(error => {
          j()
        })
      })
    }

  },
  [TreeNodeType.KEY]: {
    icon: '\ue775'
  },
  [TreeNodeType.INDEXES]: {
    icon: '\ueac5',
    getChildren: (params: ITableParams) => {
      return new Promise((r: (value: ITreeNode[]) => void, j) => {

        mysqlServer.getIndexList(params).then(res => {
          const tableList: ITreeNode[] = res?.map(item => {
            return {
              name: item.name,
              nodeType: TreeNodeType.INDEX,
              key: item.name,
              isLeaf: true,
            }
          })
          r(tableList);
        }).catch(error => {
          j()
        })
      })
    }
  },
  [TreeNodeType.INDEX]: {
    icon: '\ue65b'
  }
}