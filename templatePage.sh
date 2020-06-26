#!/bin/bash

. ./personal.sh # Source personal env vars like CV_MD_SOURCE
# turns out post type isn't all that nessisary
posttype="organizations" #default post type
dest="content"
[ -z ${CV_MD_SOURCE+x} ] || dest=$CV_MD_SOURCE

lastIFS=$IFS
IFS=" "

# first argument is name of post and possibly folder
if [ "$1" ]; then
  org="$1"
  filepostname=""
  foldername=""
  sectiontype="organization"
  read -r -a postnameArray <<< $1
  for element in "${postnameArray[@]}"
  do
    lowerEl=`echo "$element" | tr '[:upper:]' '[:lower:]'`
    filepostname="$filepostname$lowerEl"
  done
  postcat="$filepostname"
  if [ "$2" ]; then
    org="$2"
    read -r -a postorgArray <<< $2
    for el in "${postorgArray[@]}"
    do
      lowerE=`echo "$el" | tr '[:upper:]' '[:lower:]'`
      foldername="$foldername$lowerE"
    done
    postcat="$foldername"
    sectiontype="role"
  fi
  echo "Going to make file $foldername/$filepostname.md"
  [ -f $dest/$posttype/$postcat/$filepostname.md ] && echo "post exist" && exit 0
  mkdir -p "$dest/$posttype/$postcat"
  fileToMake=$dest/$posttype/$postcat/$filepostname.md
  touch $fileToMake
  primerole=""
  [ $sectiontype == "role" ] && primerole=$1
  echo "---" >> $fileToMake
  echo "organization: \"$org\"" >> $fileToMake
  echo "type: \"$sectiontype\"" >> $fileToMake
  echo "fields: \"\"" >> $fileToMake
  echo "orgtype: \"Sole Proprietorship\"" >> $fileToMake
  echo "startdate: \"2013-09-12\"" >> $fileToMake
  echo "enddate: \"\"" >> $fileToMake
  echo "link: \"\"" >> $fileToMake
  echo "summary: \"\"" >> $fileToMake
  echo "roles: \"$primerole\"" >> $fileToMake
  echo "projects: \"\"" >> $fileToMake
  echo "skillslearned: \"\"" >> $fileToMake
  echo "skillsused: \"\"" >> $fileToMake
  echo "softskills: \"\"" >> $fileToMake
  echo "---" >> $fileToMake 
  code $dest/$posttype/$postcat/$filepostname.md
fi

IFS=$lastIFS



