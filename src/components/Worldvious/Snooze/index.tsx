import React, { FC, useState } from "react"
import { app, useService } from "@kubevious/ui-framework"

import { IWorldviousService } from "@kubevious/ui-middleware"
import { WorldviousNotificationKind, WorldviousFeedbackSnoozeData } from "@kubevious/ui-middleware/dist/services/worldvious"
import { Button } from "@kubevious/ui-components"

import styles from './styles.module.css';

export type SnoozeState = {
    isSnoozed: boolean
}

export type SnoozeProps = {
    id: string,
    kind: WorldviousNotificationKind,
    onClear? : () => void;
}

export const Snooze : FC<SnoozeProps> = ({ id, kind, onClear }) => {

    const [isSnoozed, setIsSnoozed] = useState<boolean>(false);

    const service = useService<IWorldviousService>({ kind: 'worldvious' });

    const submit = (days: number | null) => {
        const data : WorldviousFeedbackSnoozeData = {
            kind: kind,
            id: id,
            days: days ?? 0,
        }

        service!.submitSnooze(data)
            .then(() => {

                app.operationLog.report("Update snoozed.");
                
                if (onClear) {
                    onClear();
                }
            })

    }

    return (
        <div className={styles.snoozeButtons}>
            
            {kind == WorldviousNotificationKind.message && (
                <>
                    <Button onClick={() => submit(null)}
                            type='ghost'>
                        Mark as read
                    </Button>
                </>
            )}
            
            {isSnoozed ? (
                <>
                    <Button onClick={() => submit(1)}
                            type='dark'>
                        Tomorrow
                    </Button>
                    <Button onClick={() => submit(7)}
                            type='dark'>
                        In a week
                    </Button>
                </>
            ) : (
                <Button onClick={() => setIsSnoozed(true)}
                        type='ghost'>
                    Remind later
                </Button>
            )}
        </div>
    )
}
