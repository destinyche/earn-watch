@echo off
echo Building application...
call npm run build

echo Creating deployment directory...
if exist deployment rd /s /q deployment
mkdir deployment

echo Copying files...
xcopy /E /I .next deployment\.next
xcopy /E /I public deployment\public
xcopy /E /I node_modules deployment\node_modules
copy package.json deployment\
copy server.js deployment\
copy .env.local deployment\

echo Creating zip file...
cd deployment
powershell Compress-Archive -Path * -DestinationPath ..\adrewards.zip -Force
cd ..

echo Cleaning up...
rd /s /q deployment

echo Done! Upload adrewards.zip to your cPanel 