<template>
    <q-dialog v-model="exibeModal" persistent>
        <q-layout view="Lhh lpR fff" container class="bg-brown tamanhoModal">
            <q-header class="bg-dark col-12 row" style="padding: 5px">
                <q-toolbar-title>Alterar Senha</q-toolbar-title>
                <q-btn flat v-close-popup dense icon="close" align="right" />
            </q-header>

            <q-page-container>
                <q-page style="padding: 10px">
                    <div class="col-12 row">
                        <q-input :error="erroSenha" :error-message="erroMSGSenha" v-model="senha" class="col-md-6 col-xs-12 inputSenha" color="dark" label-color="dark" bg-color="white" filled label="Senha">
                            <template v-slot:prepend>
                                <q-icon name="vpn_key" color="brown" />
                            </template>
                        </q-input>

                        <q-input :error="erroConfirmaSenha" :error-message="erroMSGConfirmaSenha" v-model="confirmaSenha" class="col-md-6 col-xs-12 inputSenha" color="dark" label-color="dark" bg-color="white" filled label="Confirmar Senha">
                            <template v-slot:prepend>
                                <q-icon name="password" color="brown" />
                            </template>
                        </q-input>
                    </div>
                    <q-footer class="transparent">
                        <div class="row justify-center q-mb-md">
                            <q-btn @click="fechaModal" color="red" icon="close" label="Fechar" class="botaoModal" />
                            <q-btn @click="teste" color="green" icon="save" label="Salvar" class="botaoModal" />
                        </div>
                    </q-footer>
                </q-page>
            </q-page-container>
        </q-layout>
    </q-dialog>
</template>

<script>
import { PatchComCabecalho } from 'src/utils/Conexao.js'
import { UsuarioAlteraSenha } from 'src/models/Usuarios/Usuario.js'

export default {
    name: 'Modal-TrocaSenha',
    data() {
        return {
            exibeModal: false,
            erroSenha: false,
            erroConfirmaSenha: false,
            token: '',
            idUsuario: '',
            erroMSGSenha: '',
            erroMSGConfirmaSenha: '',
            senha: '',
            confirmaSenha: ''
        }
    },
    methods: {
        abreModalTrocaSenha(id, token) {
            this.exibeModal = !this.exibeModal
            this.idUsuario = id
            this.token = token
            console.log(dados)
        },
        teste() {
            console.log(this.token)
            console.log(this.idUsuario)
        },
        confirmacao() {
            return new Promise((resolve, reject) => {
                this.$q.dialog({
                    dark: true,
                    title: 'Confirma a alteração desta senha ?',
                    cancel: 'Sair',
                    persistent: true
                }).onOk(() => {
                    resolve()
                })
            })
        },
        fechaModal() {
            this.exibeModal = !this.exibeModal
            this.limparCampos()
        },
        limparCampos() {
            this.senha = null
            this.confirmaSenha = null
        },
        comparaSenha() {
            return new Promise(resolve => {
                var senha = this.senha.toLowerCase()
                var confirmaSenha = this.confirmaSenha.toLowerCase()
                if (senha === confirmaSenha) {
                    resolve(true)
                } else {
                    this.erroConfirmaSenha = true
                    this.erroMSGConfirmaSenha = 'Esta senha não confere com a outra'
                    this.$q.notify({
                        type: 'negative',
                        message: 'Atenção, as senhas não conferem!',
                        timeout: '2000'
                    })
                    setTimeout(() => {
                        this.confirmaSenha = null
                        this.erroConfirmaSenha = false
                        this.erroMSGConfirmaSenha = null
                    }, 2000)
                }
            })
        },
        validaCampos() {
            return new Promise(resolve => {
                var campoVazio = false

                if (this.senha === '' || this.senha === null || this.senha === undefined) {
                    campoVazio = true
                    this.erroSenha = true
                    this.erroMSGSenha = 'Este campo é obrigatório'
                } else {
                    campoVazio = false
                    this.erroSenha = false
                    this.erroMSGSenha = null
                }

                if (this.confirmaSenha === '' || this.confirmaSenha === null || this.confirmaSenha === undefined) {
                    campoVazio = true
                    this.erroConfirmaSenha = true
                    this.erroMSGConfirmaSenha = 'Este campo é obrigatório'
                } else {
                    campoVazio = false
                    this.erroConfirmaSenha = false
                    this.erroMSGConfirmaSenha = null
                }

                if (campoVazio === false) {
                    resolve(true)
                }
            })
        },
        salvarAlteracaoSenha() {
            this.validaCampos().then(() => {
                this.comparaSenha().then(() => {
                    var usuario = new UsuarioAlteraSenha()
                    usuario.Id = this.idUsuario
                    usuario.Senha = this.senha.toLowerCase()
                    usuario.PrimeiroAcesso = 'N'
                    PatchComCabecalho('v1/usuario/senha', usuario, this.token).then(res => {
                        if (res.data.status == true) {
                            this.$q.notify({
                                type: 'positive',
                                message: res.data.msg,
                                timeout: '2000'
                            })
                            setTimeout(() => {
                                this.fechaModal()
                                this.$q.notify({
                                    color: 'primary',
                                    message: 'Faça login com a nova senha',
                                    timeout: '2000'
                                })
                            }, 2000)
                            localStorage.removeItem('token')
                        } else {
                            this.$q.notify({
                                type: 'negative',
                                message: res.data.msg,
                                timeout: '2000'
                            })
                        }
                    }).catch(err => {
                        console.log(err)
                        this.$q.notify({
                            type: 'negative',
                            message: 'Erro, não foi possível fazer a alteração, tente novamente mais tarde...',
                            timeout: '2000'
                        })
                    })
                })
            })
        }
    }
}
</script>

<style scoped>
    .tamanhoModal {
        display: flex;
        height: 250px;
        width: 800px;
    }
    
    .inputSenha {
        padding: 5px;
    }

    .botaoModal {
        margin: 2px;
    }

    @media only screen and (max-width: 499px) {
        .tamanhoModal {
            width: 100%;
        }
    }
</style>