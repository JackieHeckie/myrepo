import { TreeNodeType } from '@/constants/tree';
import { DatabaseTypeCode } from '@/constants/database';

export interface ITreeNode {
  key: string | number;
  name: string;
  treeNodeType: TreeNodeType;
  databaseType: DatabaseTypeCode;
  isLeaf?: boolean;
  children?: ITreeNode[];
  columnType?: string;
}