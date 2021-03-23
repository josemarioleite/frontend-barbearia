<template>
    <div class="container">
        <div class="column items-center">
            <q-img alt="barber" src="../assets/man3.jpg" class="imagemFundo" />
            <!-- <q-img alt="barber" src="../assets/brucebarber.png" class="imagemLogo" /> -->
            <div class="quadroLogin">
                <div class="text-dark areaLogin text-brown" style="text-align: center">Área de Login</div>
                <hr>
                <q-input :rules="[ val => val && val.length > 1 || 'Por favor, informe seu Login']" @keypress.enter="nextFocus" v-model="usuario" placeholder="Login" hint="Digite o seu usuário..." class="q-mt-md" />
                <q-input ref="inputSenha" :rules="[ val => val && val.length > 1 || 'Por favor, informe sua Senha']" @keypress.enter="fazerLogin" v-model="senha" placeholder="Senha" type="password" hint="Digite a sua senha cadastrada" />
                <div class="q-mt-md column">
                    <q-btn @click="fazerLogin" color="brown" align="center" class="botaoEntrar" label="Entrar" style="align-self: center; width: 50%" />
                </div>
            </div>
        </div>
        <ModalTrocaSenha ref="modalTrocaSenha" />
    </div>
</template>

<script>
import {Usuario} from '../models/Usuarios/Usuario'
import {Post, Get} from '../utils/Conexao'
import {DecodeJWT} from '../utils/Jwt'
import ModalTrocaSenha from 'src/components/Modal/ModalAlteraSenha.vue'
export default {
    name: 'Login',
    components: { ModalTrocaSenha },
    data () {
        return {
            usuario: '',
            senha: ''
        }
    },
    methods: {
        nextFocus() {
            this.$refs.inputSenha.focus()
        },
        abreModalAlteraSenha() {
            this.$refs.modalTrocaSenha.abreModalTrocaSenha()
        },
        fazerLogin () {
            const user = new Usuario()
            user.Login = this.usuario.toLowerCase()
            user.Senha = this.senha.toLowerCase()
            this.$q.notify({
                message: 'carregando...',
                color: 'blue',
                timeout: '500'
            })
            setTimeout(() => {
                Post('v1/auth/login', user).then(async (res) => {
                    this.$q.notify({
                        message: 'Logado com sucesso',
                        color: 'green',
                        timeout: 3000
                    })
                    localStorage.setItem('token', res.data.token)
                    localStorage.setItem('tokenContent', await DecodeJWT())
                    this.$router.push('/home')
                    // var dados = res.data
                    // if (dados.ativo === 'S' && dados.primeiroAcesso === 'S') {
                    //     localStorage.setItem('token', res.data.token)
                    //     this.abreModalAlteraSenha(res.data.idUsuario, res.data.token)
                    // } else if (dados.ativo === 'N') {
                    //     this.$q.notify({
                    //         message: 'Este usuário foi desativado!',
                    //         color: 'red',
                    //         timeout: 2000
                    //     })
                    // } else if (dados.ativo === 'S' && dados.primeiroAcesso === 'N') {
                    //     this.$q.notify({
                    //         message: 'Logado com sucesso',
                    //         color: 'green',
                    //         timeout: 3000
                    //     })
                    //     localStorage.setItem('token', res.data.token)
                    //     localStorage.setItem('tokenContent', await DecodeJWT())
                    // } else {
                    //     this.$q.notify({
                    //         message: res.data.msg,
                    //         color: 'red',
                    //         timeout: 3000
                    //     })
                    // }
                }).catch(() => {
                    this.senha = null
                    this.$q.notify({
                        message: 'Erro, tente novamente',
                        caption: 'Login ou Senha incorretos',
                        color: 'red'
                    })
                })
            },1000)
        },
        verificaTokenValido() {
            var obj = localStorage.getItem('token')
            if (obj != null) {
                Get('v1/empresa/usuario/token').then(res => {
                    if (res.status == 200) {
                        this.$router.push('/home')
                    }
                }).catch(err => {})
            }
        },
    },
    beforeMount() {
        this.verificaTokenValido()
    }
}
</script>

<style>
    .botaoEntrar {
        border-radius: 10px;
        color: rgb(255, 255, 255);
    }

    .container {
        min-height: 100%;
    }

    .areaLogin {
        font-size: 1.5rem;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif
    }

    .quadroLogin {
        position: absolute;
        /* color: #fff;
        /* background-color: rgb(253, 253, 253); */
        padding: 8px;
        background: #fff;
        border-radius: 15px;
        border: 1px solid ;
        height: 300px;
        width: 350px;
        /* margin-right: 5%; */
        top: 55%;
        transform: translateY(-50%);
    }

    .imagemFundo {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    @media only screen and (max-width: 1440px) {
        .imagemLogo {
            margin-top: 250px;
            margin-left: 850px;
            width: 25%;
        }
    }

    @media only screen and (min-width: 1600px) {
        .imagemLogo {
            margin-top: 430px;
            margin-left: 850px;
            width: 20%;
        }
    }

    @media only screen and (max-width: 599px) {
        .quadroLogin {
            width: 335px;
            height: 300px;
            margin-right: 4%;
            margin-left: 15px;
        }

        .botaoEntrar {
            background: rgb(179, 17, 25);
            border-radius: 10px;
            color: rgb(255, 255, 255);
            margin-top: 10px;
        }

        .imagemLogo {
            margin-top: 80px;
            margin-left: 0;
            width: 100%;
        }
    }
</style>