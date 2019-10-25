import { Negociacoes, Negociacao } from '../models/index';
import { MensagemView, NegociacoesView } from '../views/index';
import { NegociacaoService} from '../services/index';
import { domInject, throttle } from '../helpers/decorators/index';
import { imprime } from '../helpers/index';

export class NegociacaoController {

    @domInject('#data')
    private _inputData: JQuery;

    @domInject('#quantidade')
    private _inputQuantidade: JQuery;
    
    @domInject('#valor')
    private _inputValor: JQuery;
    private _negociacoes = new Negociacoes();
    private _negociacoesView = new NegociacoesView('#negociacoesView');
    private _mensagemView = new MensagemView('#mensagemView');
    private _service = new NegociacaoService();

    constructor() {
        this._negociacoesView.update(this._negociacoes);
    }

    adiciona(event: Event) {

        let data = new Date(this._inputData.val().replace(/-/g, ','));

        if (this.ehDiaUtil(data)) {

            this._mensagemView.update('Negociações não são permitidas em finais de semana!'); 

            return
        }
        const negociacao = new Negociacao(
            data, 
            parseInt(this._inputQuantidade.val()),
            parseFloat(this._inputValor.val())
        );

        this._negociacoes.adiciona(negociacao);

        this._negociacoesView.update(this._negociacoes);
        this._mensagemView.update('Negociação adicionada com sucesso!');

        imprime(negociacao, this._negociacoes);
    }

    async importaDados() {

        try {

            const negociacoesParaImportar = await this._service
                .obterNegociacoes(res => {
                    if(res.ok) {
                        return  res
                    } else {
                        throw new Error(res.statusText);
                    }
                });

            const negociacoesJaImportadas = this._negociacoes.paraArray();

            negociacoesParaImportar
                .filter(negociacao => !negociacoesJaImportadas
                    .some(jaImportada => negociacao.ehIgual(jaImportada))
                )
                .forEach(negociacao => this._negociacoes.adiciona(negociacao));

            this._negociacoesView.update(this._negociacoes);
        
        } catch(err) {
                this._mensagemView.update(err.message);
        }
    }

    private ehDiaUtil(data: Date) {
        return data.getDay() == DiaDaSemana.domingo || data.getDay() == DiaDaSemana.sabado;
    }
}

enum DiaDaSemana {
    domingo,
    segunda, 
    terca, 
    quarta, 
    quinta, 
    sexta, 
    sabado
}
