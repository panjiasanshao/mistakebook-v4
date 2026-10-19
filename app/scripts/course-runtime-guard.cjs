const fs=require('node:fs');
if(process.platform!=='linux'||process.versions.node!=='22.12.0'||(!fs.existsSync('/.dockerenv')&&!fs.existsSync('/run/.containerenv'))){
  console.error('COURSE_CONTAINER_REQUIRED: use ai-coding-env/scripts/Invoke-CourseProject.ps1 with the project binding. Dependency failures use -Action Repair; do not disable engine checks or install on the host.');
  process.exit(2);
}
