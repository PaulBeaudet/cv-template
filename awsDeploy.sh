#!/bin/bash
. ./personal.sh # Load personal configuration

# The following ended up being a half hearted attempt to
# Automate the process of setting up a static site
#-------------Set up process-----------------
# echo "creating website in $BUCKET_NAME"

# aws s3 mb s3://$BUCKET_NAME
# aws s3 website s3://$BUCKET_NAME/ --index-document index.html --error-document page-data/404.html

# The following didn't work, entered the same policy manually...
# echo "setting bucket policy from bucket_policy.json"
# aws s3api put-bucket-policy --bucket s3://$BUCKET_NAME --policy file://bucket_policy.json

# echo "Creating cloudfront distribution"
# echo "Creating a record alias for domain"
#------------Set up process----------------

#-------------deployment----------------
echo "starting website build from scratch"
gatsby clean   # Seems like old files stick around otherwise?
echo "building website"
gatsby build

echo "syncing website to $BUCKET_NAME"
aws s3 sync public/ s3://$BUCKET_NAME/ --delete --exclude "*.sh"
echo "done syncing"
