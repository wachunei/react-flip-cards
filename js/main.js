
/*
* DATA
*/
var cards1 = [
  {
    front: "1 + 1",
    back: "2",
    id: 1
  },
  {
    front: "1 + 3",
    back: "4",
    id: 2
  },
  {
    front: "1 + 5",
    back: "6",
    id: 3
  },
  {
    front: "1 + 7",
    back: "8",
    id: 4
  },
  {
    front: "3 + 3",
    back: "6",
    id: 5
  },
  {
    front: "4 + 1",
    back: "5",
    id: 6
  },
  {
    front: "2 + 3",
    back: "5",
    id: 7
  },
  {
    front: "9 + 2",
    back: "11",
    id: 8
  },
  {
    front: "2 + 7",
    back: "9",
    id: 9
  },
  {
    front: "6 + 8",
    back: "14",
    id: 10
  }
];

var cards2 = [];
var decks = [
  {title:"Two digits sum", id:1, cards: cards1},
  {title:"Another deck", id:2, cards: cards2}
];

/*
* Components
*/

// Main App
var App = React.createClass({
  getInitialState: function() {
    return {
      selected: undefined
    };
  },
  handleSelect: function(id, e) {
    var selected = decks.filter(deck => deck.id == id)[0];
    this.setState({selected: selected});
  },
  deleteCard: function(id, e) {
    var filteredCards = this.state.selected.cards.filter(card => card.id != id);
    var newDeck = this.state.selected;
    newDeck.cards = filteredCards;
    this.setState({selected: newDeck});
  },
  render: function() {
    var selectedName
    return (
      <div>
      <header id="main-header"><h1>React Flip Cards {this.state.selected? '» '+ this.state.selected.title: ''}</h1></header>
      <DecksList decks={decks} clickHandle={this.handleSelect} />
      <DeckStage cards={this.state.selected ? this.state.selected.cards: undefined} handleDelete={this.deleteCard}/>
      </div>
    );
  }
});

// decks List
var DecksList = React.createClass({
  getInitialState: function() {
    return {
      selected: undefined
    };
  },
  handleSelect: function(id, e) {
    this.props.clickHandle(id, e);
    this.setState({selected: id});
  },
  render: function() {
    var self = this;
    var decks = this.props.decks.map(function(deck) {
      return <Deck
      isSelected={self.state.selected == deck.id}
      title={deck.title}
      key={deck.id}
      id={deck.id}
      clickHandle={self.handleSelect} />});

    return (
      <div id="decks-list">
        {decks}
      </div>
    );
  },

});

// deck for list display
var Deck = React.createClass({
  titleClick: function(id,e) {
    e.preventDefault();
    this.props.clickHandle(id, e);
  },
  render: function() {
    var deckClasses = classNames({'deck': true, 'selected': this.props.isSelected})
    return (
      <div className={deckClasses}>
        <a href="#" className="deck-title" onClick={this.titleClick.bind(this, this.props.id)}>{this.props.title}</a>
      </div>
    );
  }
});

// deck stage for display
var DeckStage = React.createClass({
  handleDelete: function(id, e) {
    this.props.handleDelete(id, e);
  },
  render: function() {
    if(!this.props.cards) {
      return (
        <div id="deck-stage">
          <span className="alert-message">Select a deck</span>
        </div>
      );
    }

    if(this.props.cards.length == 0) {
      return (
        <div id="deck-stage">
          <span className="alert-message">This deck has no cards</span>
        </div>
      );
    }

    var cards = this.props.cards.map(card =>
      <Card key={card.id}
      id={card.id}
      front={card.front}
      back={card.back} handleDelete={this.handleDelete} />);

    return (
      <div id="deck-stage">
       <div className="cards-container">{cards}</div>
      </div>
    );
  }
});

// deck cards for deck display
var Card = React.createClass({
  getInitialState: function() {
    return ({flipped: false, gone: false});
  },
  flipCard: function(e) {
    var nextState = !this.state.flipped
    this.setState({flipped: nextState});
  },
  deleteCard: function(id, e) {
    this.setState({gone: true});
    this.props.handleDelete(id, e);
  },
  render: function() {
    var cardClasses = classNames({'card':true, 'flipped': this.state.flipped, 'gone': this.state.gone});
    var cardActionsTop = <div className="card-actions card-actions-top">
      <span className="card-action" onClick={this.deleteCard.bind(this, this.props.id)} >Delete ╳</span>
    </div>;
    var cardActionsBottom = <div className="card-actions card-actions-bottom">
      <span className="card-action" onClick={this.flipCard}>
        ↪ Flip Card
      </span>
    </div>;
    return (
      <div className={cardClasses}>
        <div className="card-front">
          {cardActionsTop}
          <div className="card-content">
            {this.props.front}
          </div>
          {cardActionsBottom}
        </div>
        <div className="card-back">
          {cardActionsTop}
          <div className="card-content">
            {this.props.back}
          </div>
          {cardActionsBottom}
        </div>
      </div>
    );
  }
});


ReactDOM.render(
  <App />, document.getElementById('content')
);
