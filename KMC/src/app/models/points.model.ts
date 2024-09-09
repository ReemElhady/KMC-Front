export interface Points {
  points_list: [
    {
      order_id: string
      created_at: string,
      points: number,
      used_points: number,
      is_expired: true,

    }
  ],
  total_points: number,
  total_points_value:number;
  first_points_to_expire:number,
  total_used_points:number,
  first_points_to_expire_date:string
}
