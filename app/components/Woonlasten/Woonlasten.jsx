var React = require('react');

function getAftoppingsGrens(moreThanTwoPeopleHousehold) {
  return moreThanTwoPeopleHousehold ? 618.24 : 576.68;
}

var Woonlasten = React.createClass({
  componentDidMount: function () {
    console.log("mounted");
  },

  getInitialState: function () {
    return {
      //http://gemiddeldgezien.nl/gemiddelde-kosten-gas-water-licht
      gas: 72,
      water: 9,
      licht: 63,

      // belastingen
      waterschap: 68.80,
      afvalstoffen: 205.05,

      servicekosten: 36,
      kaleHuur: 355,
      basishuur: 231,
      moreThanTwoPeopleHousehold: false,
      aftoppingsgrens: getAftoppingsGrens(false),
      factorTotAftopping: 0.0,
      factorBovenAftopping: 0.0
    }
  },

  changeState: function (name) {
    var _this = this;
    return function (event) {
      var newState = {};
      newState[name] = parseInt(event.target.value);
      console.log(event);
      console.log("Changing '" + name + "' to " + newState[name]);
      _this.setState(newState);
    };
  },

  getDefaultProps: function () {
    return {
      referentieNormHuur: 411.05,
      minimumBasisHuur: 231
    }
  },

  render: function () {
    var $gas = this.state.gas;
    var $water = this.state.water;
    var $elektra = this.state.licht;

    var moreThanTwoPeopleHousehold = this.state.moreThanTwoPeopleHousehold;
    var $kalehuur = this.state.kaleHuur;
    var $servicekosten = this.state.servicekosten;
    var $huur = $kalehuur + $servicekosten;

    var $basishuur = this.state.basishuur;
    var $kwaliteitskorting = 403.06;
    var $aftoppingsgrens = moreThanTwoPeopleHousehold ? 618.24 : 576.68;
    var $mysteriousFactorTotAftopping = 0.0;
    var $mysteriousFactorBovenAftopping = 0.0;

    // Tussen basishuur en kwaliteitskorting
    var $huurBovenBasishuur = Math.max(0, $huur - $basishuur);
    var $toeslagTotKwaliteitsKorting = Math.min($kwaliteitskorting, $huurBovenBasishuur);

    // Tussen kwaliteitskorting en aftopping
    var $toeslagTotAftoppingsGrens = 0;
    var $huurBovenKwaliteitskorting = Math.max(0, $huur - $kwaliteitskorting);
    if ($huurBovenKwaliteitskorting > 0) {
      var $bovenKwaliteitsKortingTotAftoppingsGrens = Math.min($aftoppingsgrens - $kwaliteitskorting, $huurBovenKwaliteitskorting);
      $toeslagTotAftoppingsGrens = $mysteriousFactorTotAftopping * $bovenKwaliteitsKortingTotAftoppingsGrens;
    }

    // Boven aftopping
    var $toeslagBovenAftoppingsGrens = 0;
    var $huurBovenAftopping = Math.max(0, $huur - $aftoppingsgrens);
    if ($huurBovenAftopping > 0) {
      $toeslagTotAftoppingsGrens = $mysteriousFactorBovenAftopping * $huurBovenAftopping;
    }

    var $huurtoeslag = $toeslagTotKwaliteitsKorting + $toeslagTotAftoppingsGrens + $toeslagBovenAftoppingsGrens;

    var $waterschap = this.state.waterschap / 12;
    var $afvalstoffen = this.state.afvalstoffen / 12;

    var $belastingen = $waterschap + $afvalstoffen;

    var $gasWaterLicht = $gas + $water + $elektra;

    var chill = {color: 'green'};
    var nietChill = {color: 'red'};

    return <div className={"outer"}>
      <div className={"inner"}>
        {this.props.path === '/' ? null : <h1>{this.props.title}</h1>}
        <form>
          <label>Kale huur <input value={$kalehuur} onChange={this.changeState('kaleHuur')}
                                  type="number"/></label><br />
          <label>Servicekosten <input value={$servicekosten} type="number"
                                      onChange={this.changeState('servicekosten')}/></label><br />
          <label>Basishuur <input value={$basishuur} type="number"
                                  onChange={this.changeState('basishuur')}/></label><br />
          <label>Aantal mensen in huishouden <select>
            <option value="lte2">0-2</option>
            <option value="gt2">&gt; 2</option>
          </select></label><br />
          <label>Gas <input value={$gas} type="number" onChange={this.changeState('gas')}/></label><br />
          <label>Water <input value={$water} type="number" onChange={this.changeState('water')}/></label><br />
          <label>Elektra <input value={$elektra} type="number" onChange={this.changeState('licht')}/></label><br />
          <label>
            <a href="http://www.hdsr.nl/belastingen/@33046/tarieven/">
              Waterschapsbelasting per jaar</a>
            <input value={this.state.waterschap} type="number"/></label><br />

          <label>
            <a href="http://www.bghu.nl/kennisbank/index.php?nid=1213&loc=utrecht">
              Afvalstoffenheffing per jaar</a>
            <input value={this.state.afvalstoffen} type="number"/></label><br />

        </form>

        <table>

          <tbody>
          <tr>
            <td>Huur</td>
            <td><code style={nietChill}>{$huur}</code></td>
          </tr>
          <tr>
            <td>Gas</td>
            <td><code style={nietChill}>+{$gas}</code></td>
          </tr>
          <tr>
            <td>Elektra</td>
            <td><code style={nietChill}>+{$gas}</code></td>
          </tr>
          <tr>
            <td>tv/internet</td>
            <td><code style={nietChill}>+{$gas}</code></td>
          </tr>
          <tr>
            <td>Waterschapsbelasting</td>
            <td><code style={nietChill}>+{$waterschap}</code></td>
          </tr>
          <tr>
            <td>Afvalstoffen</td>
            <td><code style={nietChill}>+{$afvalstoffen}</code></td>
          </tr>
          <tr>
            <td>Huurtoeslag</td>
            <td><code style={chill}>-{$huurtoeslag}</code></td>
          </tr>
          <tr>
            <td>Woonkosten</td>
            <td><code>{$huur - $huurtoeslag + $gasWaterLicht + $belastingen}</code></td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>;
  }
});

module.exports = Woonlasten;
