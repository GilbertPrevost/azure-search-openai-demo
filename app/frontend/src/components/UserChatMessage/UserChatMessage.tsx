import styles from "./UserChatMessage.module.css";

interface Props {
    message: string;
}

export const UserChatMessage = ({ message }: Props) => {
    return (
        <div className={styles.container}>
            <div className={styles.message}>
                <img src="/bussiness-man.png" alt="Me" width="40" height="40" className={styles.usericon} />
                <div className={styles.userName}>
                    <span className={styles.userfont}>User 1</span>
                    <br />
                    {message}
                </div>
                {/* <span className={styles.userfont}>User 1</span>
              <br/>
                {message} */}
            </div>
        </div>
    );
};
