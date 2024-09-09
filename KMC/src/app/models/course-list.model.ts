export interface CoursesList {
  id: number;
  type: number;
  branch: number;
  title: string;
  fees?: number;
  image: string;
  description: string;
  number_of_videos: number;
  duration: string;
  level: string;
  instructor_name: string;
  instructor_position: string;
  link?: string;
  language?: string;
  iframe_link:string
  brand:number;
}
