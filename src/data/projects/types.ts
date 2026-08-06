export interface Project {
  id: string;
  title: string;
  desc: string;
  stack: string;
  links: { label: string; url: string }[];
}
