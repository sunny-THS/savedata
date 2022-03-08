import showFile from './showFile.js'
import handleFolder from './handleFolder.js'
import iFile from './inputFile.js'
import uploadFiles from './uploadFile.js'

var accessToken = sessionStorage.getItem('token');

window.onload = function() {
    loadFiles(sessionStorage.getItem('token'));
    
};

function loadFiles(token) {
    handleFolder(token)
    .then(data => {
        showFile(data);
        document.querySelector('.configUser').remove();
        document.querySelectorAll('.nav-link').forEach(el=>el.classList.remove('disabled'));
        Toast.fire({
            icon: 'success', 
            title: `Hi ${sessionStorage.getItem('username')}!`
        });
    }).catch(err => {
        if (err.message == 'Forbidden') {
            ConfigUser();
        } else {
            document.querySelector('.configUser').remove();
            document.querySelectorAll('.nav-link').forEach(el=>el.classList.remove('disabled'));
            Toast.fire({
                icon: 'success', 
                title: `Hi ${sessionStorage.getItem('username')}!`
            });
        }
    }).finally(() => {
        initEventLogin();
    });    
}

function initEventRegister() {
    document.getElementById('txtUsernameRegister').addEventListener('keyup', e => {
        if (e.code == 'Enter')
            swal.clickConfirm();
    });

    document.getElementById('txtPwRegister').addEventListener('keyup', e => {
        if (e.code == 'Enter')
            swal.clickConfirm();
    });
}

function initEventLogin() {
    document.getElementById('txtUsername').addEventListener('keyup', e => {
        if (e.code == 'Enter')
            swal.clickConfirm();
    });

    document.getElementById('txtPw').addEventListener('keyup', e => {
        if (e.code == 'Enter')
            swal.clickConfirm();
    });
}

document.getElementById('btnLogin').addEventListener('click', (e) => {
    ConfigUser();
    initEventLogin()
});

document.getElementById('btnLogout').addEventListener('click', e => {
    sessionStorage.setItem('token', null);
    sessionStorage.setItem('username', null);
    location.reload();
});

document.getElementById('btnUploadFile').addEventListener('click', e => {
    Swal.fire({
        showCloseButton: true,
        confirmButtonText: 'Upload <i class="fa fa-arrow-up-from-bracket"></i>',
        confirmButtonColor: '#08e2e3',
        showLoaderOnConfirm: true,
        html:`
        <input id="f" name="file" type="file" class="inputfile" data-multiple-caption="{count} files selected" multiple />
        <label for="f">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17">
                <path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/>
            </svg>
            <span id="filename">Choose a file...</span>
        </label>
        <style>
        .inputfile {
            width: 0.1px;
            height: 0.1px;
            opacity: 0;
            overflow: hidden;
            position: absolute;
            z-index: -1;
        }
        .inputfile + label {
            color: #d3394c;
            max-width: 80%;
            font-size: 2rem;
            font-weight: 700;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: pointer;
            display: inline-block;
            overflow: hidden;
            padding: 0.625rem 1.25rem;
        }
        .inputfile + label svg {
            width: 1em;
            height: 1em;
            fill: currentColor;
            vertical-align: middle;
            margin-top: -0.25em;
            margin-right: 0.25em;
        }
        .inputfile + label {
            cursor: pointer; /* "hand" cursor */
        }
        .inputfile + label:hover {
            color: #722040;
        }
        </style>
        `,
        preConfirm: () => {
            const inputFile = document.querySelector('.inputfile');
            const files = inputFile.files;
            return uploadFiles(files);
        },
        allowEscapeKey: false,
        allowOutsideClick: false,
    }).then(rs => {
        Toast.fire({
            icon: 'success', 
            title: rs.value.message
        });
        loadFiles(sessionStorage.getItem('token'));
    }).catch(err => {

    });
    iFile();
});

function ConfigUser() {
    Swal.fire({
        title: 'Login',
        icon: 'info',
        showCloseButton: true,
        showDenyButton: true,
        reverseButtons: true,
        denyButtonColor: '#08e2e3',
        denyButtonText: 'Create new?',
        confirmButtonText: 'Continue <i class="fa fa-arrow-right"></i>',
        showLoaderOnConfirm: true,
        html:
            `
            <div class="form-floating">
                <input type="text" class="form-control mb-2" id="txtUsername" placeholder="abcd">
                <label for="txtUsername">Username</label>
            </div>
            <div class="form-floating">
                <input type="password" class="form-control mb-2" id="txtPw" placeholder="password">
                <label for="txtPw">Password</label>
            </div>
            `,
        preConfirm: () => {
            const username = document.querySelector('#txtUsername').value;
            const pw = document.querySelector('#txtPw').value;

            if (!username || !pw)
                Swal.showValidationMessage(
                    'You need to write something!'
                )
            else return login(username, pw);
        },
        preDeny: () => {
            return true;
        },
        allowEscapeKey: false,
        allowOutsideClick: false,
    }).then(result => {
        if (result.isConfirmed) {
            Toast.fire({
                icon: 'success', 
                title: `Hi ${result.value.username}!`
            });
            document.querySelector('.configUser').remove();
            document.querySelectorAll('.nav-link').forEach(el=>el.classList.remove('disabled'));

            // add session
            sessionStorage.setItem('token', result.value.accessToken);
            sessionStorage.setItem('username', result.value.username);
            handleFolder(result.value.accessToken)
                .then(data => {
                    showFile(data);
                })
        }
        if (result.isDenied) {
            Swal.fire({
                title: 'Create a username',
                icon: 'question',
                showCloseButton: true,
                showCancelButton: true,
                reverseButtons: true,
                confirmButtonText: 'Continue <i class="fa fa-arrow-right"></i>',
                cancelButtonText: '<i class="fa fa-arrow-left"></i> Cancel',
                showLoaderOnConfirm: true,
                html:
                `
                <div class="form-floating">
                    <input type="text" class="form-control mb-2" id="txtUsernameRegister" placeholder="abcd">
                    <label for="txtUsername">Username</label>
                </div>
                <div class="form-floating">
                    <input type="password" class="form-control mb-2" id="txtPwRegister" placeholder="password">
                    <label for="txtPw">Password</label>
                </div>
                `,
                preConfirm: () => {
                    const username = document.querySelector('#txtUsernameRegister').value;
                    const pw = document.querySelector('#txtPwRegister').value;

                    if (!username || !pw)
                        Swal.showValidationMessage(
                            'You need to write something!'
                        )
                    else return register(username, pw);
                },
                allowEscapeKey: false,
                allowOutsideClick: false,
            }).then(res => {
                if (res.isConfirmed) {
                    Toast.fire({
                        icon: 'success', 
                        title: 'Successfully Register!'
                    });
                }
                ConfigUser();
                initEventLogin();
            })
            initEventRegister();
        }
    })
}

async function register(username, password) {
    if (username.length < 5) {
        Swal.showValidationMessage(
            'The username must be more than 5 characters!'
        )
        return;
    }

    if (password.length < 7) {
        Swal.showValidationMessage(
            'The password must be more than 5 characters!'
        )
        return;
    }

    return await await fetch('./auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            pw: password
        }),
    })
    .then(res => {
        if (!res.ok)
            throw new Error(res.statusText);
        return res.json();
    })
    .catch(error => {
        Swal.showValidationMessage(
            'The username is exists!'
        )
    })
}

async function login(username, password) {
    return await await fetch('./auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            pw: password
        }),
    })
    .then(res => {
        if (!res.ok)
            throw new Error(res.statusText);
        return res.json();
    })
    .catch(error => {
        Swal.showValidationMessage(
            'The username or password is incorrect!'
        )
    })
}

