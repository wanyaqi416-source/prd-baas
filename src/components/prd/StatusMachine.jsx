import { stateRows } from '../../data/prdData'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { SectionHeader } from './SectionHeader'

export function StatusMachine() {
  return (
    <section id="states" className="space-y-5">
      <SectionHeader
        eyebrow="Workflow Contract"
        title="状态机"
        description="状态机用于约束页面、Admin 操作和未来接口的状态流转。"
        badges={['MVP', 'Opening Flow']}
      />
      <Card>
        <CardHeader>
          <CardTitle>US Account Opening State Machine</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Next Rule</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stateRows.map(([status, description, owner, next]) => (
                <TableRow key={status}>
                  <TableCell><Badge>{status}</Badge></TableCell>
                  <TableCell>{description}</TableCell>
                  <TableCell>{owner}</TableCell>
                  <TableCell>{next}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  )
}
