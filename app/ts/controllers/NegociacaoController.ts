import { Negociacoes, Negociacao } from '../models/index';
import { MensagemView, NegociacoesView } from '../views/index';
import { domInject } from '../helpers/decorators/index';

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

    constructor() {
        this._negociacoesView.update(this._negociacoes);
    }

    adiciona(event: Event) {

        event.preventDefault();
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
