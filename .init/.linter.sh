#!/bin/bash
cd /home/kavia/workspace/code-generation/EKYC-Front-Repo/EKYCWebFrontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

