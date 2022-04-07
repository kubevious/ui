import React, { FC, useState } from "react"
import { useService } from "@kubevious/ui-framework"

import { IWorldviousService } from "@kubevious/ui-middleware"
import { WorldviousNotificationKind } from "@kubevious/ui-middleware/dist/services/worldvious"
import { Button } from "@kubevious/ui-components"

import styles from './styles.module.css';

export type SnoozeState = {
    isSnoozed: boolean
}

export type SnoozeProps = {
    id: string
    kind: WorldviousNotificationKind
}

export const Snooze : FC<SnoozeProps> = ({ id, kind }) => {

    const [isSnoozed, setIsSnoozed] = useState<boolean>(false);

    const service = useService<IWorldviousService>({ kind: 'worldvious' });

    const submit = (days: number | null) => {
        const data = {
            kind: kind,
            id: id,
            days: days,
        }

        // TODO: FIX ME
        // this.service.submitSnooze(data, () => {})
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
