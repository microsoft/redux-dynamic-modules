import { connect } from "react-redux";
import './observable-counter-component.css';

const Counter = ({ counter }) => {
    return (
        <div className="observable-counter">
            {counter}
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        counter: state.counterAwareState.counter
    }
};

export const ConnectedHackerNews = connect(mapStateToProps)(HackerNews);