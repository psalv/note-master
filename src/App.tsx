import * as React from "react";
import { GlobalStyleResets } from "./globalStyleReset";
import { Column, Row, Spacer } from "./components/Layout";
import { Typography } from "./components/Typography";
import { sample } from "lodash";
import styled from "styled-components";
import * as Tone from "tone";

const MAX_BPM = 200;
const MS_PER_MINUTE = 60 * 1000;
const DEFAULT_BPM = 60;
const DEFAULT_CYCLE = 7;
const DEFAULT_NOTE = "C";

const NOTES = [
  "A",
  "A#/Bb",
  "B",
  "C",
  "C#/Db",
  "D",
  "D#/Eb",
  "E",
  "F",
  "F#/Gb",
  "G",
  "G#/Ab",
];

export class App extends React.Component<
  {},
  {
    bpm: number;
    cycleLength: number;
    timeUntilChange: number;
    note: string;
    on: boolean;
  }
> {
  state = {
    bpm: DEFAULT_BPM,
    cycleLength: DEFAULT_CYCLE,
    timeUntilChange: DEFAULT_CYCLE,
    note: DEFAULT_NOTE,
    on: false,
  };

  clockTick = () => {
    const note: any = sample(NOTES);
    if (this.state.timeUntilChange === 1) {
      this.setState({
        timeUntilChange: this.state.cycleLength,
        note,
      });
      new Tone.Synth().toDestination().triggerAttackRelease("F4", "32n");
    } else {
      this.setState({
        timeUntilChange: this.state.timeUntilChange - 1,
      });
      new Tone.Synth().toDestination().triggerAttackRelease("C4", "32n");
    }

    setTimeout(() => {
      if (this.state.on) {
        this.clockTick();
      }
    }, MS_PER_MINUTE / this.state.bpm);
  };

  async componentDidMount() {
    await Tone.start();
  }

  setBpm = (bpm: number) => {
    this.setState({
      bpm: Math.max(0, Math.min(MAX_BPM, bpm)),
    });
  };

  toggleOn = () => {
    this.setState(
      {
        on: !this.state.on,
        timeUntilChange: this.state.cycleLength,
      },
      () => {
        if (this.state.on) {
          this.clockTick();
        }
      }
    );
  };

  setCycleLength = (cycleLength: number) => {
    const value = Math.max(1, cycleLength);
    this.setState({
      cycleLength: value,
      timeUntilChange: value,
    });
  };

  render() {
    return (
      <div>
        <GlobalStyleResets />
        <OuterColumn>
          <InnerColumn>
            {/* prettier-ignore */}
            <Row style={{justifyContent: 'center', fontFamily: "monospace", whiteSpace: "pre", lineHeight: '13px'}}>
              ███▄    █  ▒█████  ▄▄▄█████▓▓█████     ███▄ ▄███▓ ▄▄▄        ██████ ▄▄▄█████▓▓█████  ██▀███<br/>
              ██ ▀█   █ ▒██▒  ██▒▓  ██▒ ▓▒▓█   ▀    ▓██▒▀█▀ ██▒▒████▄    ▒██    ▒ ▓  ██▒ ▓▒▓█   ▀ ▓██ ▒ ██▒<br/>
              ▓██  ▀█ ██▒▒██░  ██▒▒ ▓██░ ▒░▒███      ▓██    ▓██░▒██  ▀█▄  ░ ▓██▄   ▒ ▓██░ ▒░▒███   ▓██ ░▄█ ▒<br/>
              ▓██▒  ▐▌██▒▒██   ██░░ ▓██▓ ░ ▒▓█  ▄    ▒██    ▒██ ░██▄▄▄▄██   ▒   ██▒░ ▓██▓ ░ ▒▓█  ▄ ▒██▀▀█▄<br/>
              ▒██░   ▓██░░ ████▓▒░  ▒██▒ ░ ░▒████▒   ▒██▒   ░██▒ ▓█   ▓██▒▒██████▒▒  ▒██▒ ░ ░▒████▒░██▓ ▒██▒<br/>
              ░ ▒░   ▒ ▒ ░ ▒░▒░▒░   ▒ ░░   ░░ ▒░ ░   ░ ▒░   ░  ░ ▒▒   ▓▒█░▒ ▒▓▒ ▒ ░  ▒ ░░   ░░ ▒░ ░░ ▒▓ ░▒▓░<br/>
              ░ ░░   ░ ▒░  ░ ▒ ▒░     ░     ░ ░  ░   ░  ░      ░  ▒   ▒▒ ░░ ░▒  ░ ░    ░     ░ ░  ░  ░▒ ░ ▒░<br/>
              ░   ░ ░ ░ ░ ░ ▒    ░         ░      ░      ░     ░   ▒   ░  ░  ░    ░         ░     ░░   ░<br/>
              ░     ░ ░              ░  ░          ░         ░  ░      ░              ░  ░   ░
            </Row>
            <Spacer size={48} />
            <label htmlFor="bpm">
              <Typography>BPM</Typography>
            </label>
            <input
              id="bpm"
              value={this.state.bpm}
              onChange={(e) => {
                this.setBpm(parseInt(e.target.value));
              }}
            />{" "}
            <Spacer size={16} />
            <label htmlFor="bpm">
              <Typography>Cycle Length</Typography>
            </label>
            <input
              id="bpm"
              value={this.state.cycleLength}
              onChange={(e) => {
                this.setCycleLength(parseInt(e.target.value));
              }}
            />
            <Spacer size={16} />
            <button onClick={() => this.toggleOn()}>
              <Typography>{this.state.on ? "Turn off" : "Turn on"}</Typography>
            </button>
            <Spacer size={48} />
            <NoteRow>
              <NoteTypography>{this.state.note}</NoteTypography>
            </NoteRow>
          </InnerColumn>
        </OuterColumn>
      </div>
    );
  }
}

const NoteRow = styled(Row)`
  justify-content: center;
`;

const NoteTypography = styled(Typography)`
  font-size: 200px;
  line-height: 200px;
`;

const OuterColumn = styled(Column)`
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url("https://thumbs.gfycat.com/DeliriousHauntingHagfish-size_restricted.gif");
`;

const InnerColumn = styled(Column)`
  width: 70%;
  min-width: 764px;
  padding: 48px;
  background-color: white;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`;
