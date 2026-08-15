export interface SkillDefinition {
  id: string;
  label: string;
  category: string;
  aliases: string[];
}

export const skillDefinitions: SkillDefinition[] = [
  { id: 'javascript', label: 'JavaScript', category: 'Programming Languages', aliases: ['javascript', 'js', 'ecmascript'] },
  { id: 'typescript', label: 'TypeScript', category: 'Programming Languages', aliases: ['typescript', 'ts'] },
  { id: 'java', label: 'Java', category: 'Programming Languages', aliases: ['java'] },
  { id: 'python', label: 'Python', category: 'Programming Languages', aliases: ['python', 'py'] },
  { id: 'go', label: 'Go', category: 'Programming Languages', aliases: ['go', 'golang'] },
  { id: 'react', label: 'React', category: 'Frontend', aliases: ['react', 'react.js', 'reactjs'] },
  { id: 'vue', label: 'Vue', category: 'Frontend', aliases: ['vue', 'vue.js', 'vuejs'] },
  { id: 'angular', label: 'Angular', category: 'Frontend', aliases: ['angular'] },
  { id: 'html', label: 'HTML', category: 'Frontend', aliases: ['html', 'html5'] },
  { id: 'css', label: 'CSS', category: 'Frontend', aliases: ['css', 'css3'] },
  { id: 'nodejs', label: 'Node.js', category: 'Backend', aliases: ['node.js', 'nodejs', 'node'] },
  { id: 'express', label: 'Express', category: 'Backend', aliases: ['express', 'express.js', 'expressjs'] },
  { id: 'spring-boot', label: 'Spring Boot', category: 'Backend', aliases: ['spring boot', 'springboot'] },
  { id: 'django', label: 'Django', category: 'Backend', aliases: ['django'] },
  { id: 'postgresql', label: 'PostgreSQL', category: 'Databases', aliases: ['postgresql', 'postgres', 'postgre sql'] },
  { id: 'mysql', label: 'MySQL', category: 'Databases', aliases: ['mysql'] },
  { id: 'mongodb', label: 'MongoDB', category: 'Databases', aliases: ['mongodb', 'mongo'] },
  { id: 'redis', label: 'Redis', category: 'Databases', aliases: ['redis'] },
  { id: 'aws', label: 'AWS', category: 'Cloud and DevOps', aliases: ['aws', 'amazon web services'] },
  { id: 'azure', label: 'Azure', category: 'Cloud and DevOps', aliases: ['azure', 'microsoft azure'] },
  { id: 'gcp', label: 'Google Cloud', category: 'Cloud and DevOps', aliases: ['gcp', 'google cloud', 'google cloud platform'] },
  { id: 'docker', label: 'Docker', category: 'Cloud and DevOps', aliases: ['docker'] },
  { id: 'kubernetes', label: 'Kubernetes', category: 'Cloud and DevOps', aliases: ['kubernetes', 'k8s'] },
  { id: 'terraform', label: 'Terraform', category: 'Cloud and DevOps', aliases: ['terraform'] },
  { id: 'ci-cd', label: 'CI/CD', category: 'Cloud and DevOps', aliases: ['ci/cd', 'ci-cd', 'continuous integration', 'continuous delivery'] },
  { id: 'git', label: 'Git', category: 'Tools', aliases: ['git', 'github', 'gitlab'] },
  { id: 'rest', label: 'REST APIs', category: 'Backend', aliases: ['rest', 'rest api', 'rest apis', 'restful'] },
  { id: 'graphql', label: 'GraphQL', category: 'Backend', aliases: ['graphql'] },
  { id: 'testing', label: 'Testing', category: 'Quality', aliases: ['testing', 'unit testing', 'integration testing', 'automated tests', 'test automation'] },
  { id: 'playwright', label: 'Playwright', category: 'Quality', aliases: ['playwright'] },
  { id: 'vitest', label: 'Vitest', category: 'Quality', aliases: ['vitest'] },
  { id: 'jest', label: 'Jest', category: 'Quality', aliases: ['jest'] },
  { id: 'agile', label: 'Agile', category: 'Process', aliases: ['agile', 'scrum', 'kanban'] },
  { id: 'leadership', label: 'Leadership', category: 'Process', aliases: ['leadership', 'mentoring', 'technical leadership', 'team leadership'] },
];
