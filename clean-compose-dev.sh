docker-compose -f docker-compose-dev.yml rm -f

docker volume rm ay2324s1-course-assessment-g41_3219User
docker volume rm ay2324s1-course-assessment-g41_mongo
docker volume rm ay2324s1-course-assessment-g41_postgres
docker volume rm ay2324s1-course-assessment-g41_frontend

docker-compose -f docker-compose-dev.yml build --no-cache
docker-compose -f docker-compose-dev.yml up