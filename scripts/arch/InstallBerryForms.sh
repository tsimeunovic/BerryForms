#!/bin/bash
#Dependencies:
#nodejs mongodb git gcc make
####################################################################################
#Configuration
BF_DIR_NAME="BerryForms"
LOG_DIR_NAME="Log"
STARTUP_SCRIPT_NAME="NodeBerryForms"
GIT_URL="https://github.com/tsimeunovic/BerryForms.git"
####################################################################################
#Variables
NODE_BINARY=$(which node)
EXEC_DIR=$(pwd)
GIT_TEMP_DIR_NAME="git_temp"
BUILD_DIRECTORY="dist"
BERRY_STARTUP_FILE="${EXEC_DIR}/${BF_DIR_NAME}/BerryForms.js"
STARTUP_SCRIPT_COMMAND="${NODE_BINARY} ${BERRY_STARTUP_FILE}"
SYSTEMD_FILE_NAME="${STARTUP_SCRIPT_NAME}.service"
SYSTEMD_FILE_FULL="/etc/systemd/system/${SYSTEMD_FILE_NAME}"
####################################################################################
#Helper functions
function DeregisterStartupScript {
systemctl stop ${SYSTEMD_FILE_NAME}
systemctl disable ${SYSTEMD_FILE_NAME}
}

function RegisterStartupScript {
#Create startup script text
LOG_FILE_NAME="${EXEC_DIR}/${LOG_DIR_NAME}/${1}"
EXECUTE_ACTION="${2} ${3}"
REGISTERING_USER=${USER}
SYSTEMD_SCRIPT=$(cat <<EOF
\n[Service]
\nExecStart=/usr/bin/bash -c 'mv ${LOG_FILE_NAME} ${LOG_FILE_NAME}_\$(date +%%Y%%m%%d)_\$(date +%%s) 2> /dev/null ; ${EXECUTE_ACTION} >> ${LOG_FILE_NAME} 2>&1'
\nRestart=always
\nStandardOutput=syslog
\nStandardError=syslog
\nSyslogIdentifier=${1}
\nUser=${REGISTERING_USER}
\nGroup=${REGISTERING_USER}
\nEnvironment=NODE_ENV=production
\n
\n[Install]
\nWantedBy=multi-user.target
EOF
)

#Register startup script
rm -f ${SYSTEMD_FILE_FULL}
echo -e ${SYSTEMD_SCRIPT} > ${SYSTEMD_FILE_FULL}

systemctl enable ${SYSTEMD_FILE_NAME}
systemctl daemon-reload
systemctl start ${SYSTEMD_FILE_NAME}
systemctl status ${SYSTEMD_FILE_NAME}
}
####################################################################################
#Tasks
#Stop services
DeregisterStartupScript
killall node 2> /dev/null

#Delete all old files
rm -rf ${BF_DIR_NAME}
mkdir ${BF_DIR_NAME}

#Get latest version from GIT
git clone --depth 1 ${GIT_URL} ${BF_DIR_NAME}/${GIT_TEMP_DIR_NAME}

#Copy builded files to target directory
cp -rf ${BF_DIR_NAME}/${GIT_TEMP_DIR_NAME}/${BUILD_DIRECTORY}/* ${BF_DIR_NAME}

#Install npm dependencies
pushd .
cd ${BF_DIR_NAME}
npm install --production
popd

#Delete temporary git directory
rm -rf ${BF_DIR_NAME}/${GIT_TEMP_DIR_NAME}

#Setup nodejs startup deamon
mkdir -p ${EXEC_DIR}/${LOG_DIR_NAME}
RegisterStartupScript ${STARTUP_SCRIPT_NAME} ${STARTUP_SCRIPT_COMMAND}
