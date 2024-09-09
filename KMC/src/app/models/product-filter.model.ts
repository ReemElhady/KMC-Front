export interface Filters {
  brands: Brands[],
  branches: Branches[]
}


export interface Brands {
  name: string;
  id: number;
  image: string;
}

export interface Branches {
  id: number;
  branch_sub_branches: SubBranches[];
  name: string;
  image: string;
}

export interface SubBranches {
  name: string;
  id: number;
}

