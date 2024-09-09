export interface Course {
  id: number;
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
  type?: string;
  branch?: string;
  language?: string;
}
