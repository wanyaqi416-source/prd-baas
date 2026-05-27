import { fieldMappings } from '../../data/prdData'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { SectionHeader } from './SectionHeader'

function visibilityVariant(value) {
  if (value.includes('Admin Only')) return 'warning'
  if (value.includes('Client')) return 'success'
  return 'secondary'
}

export function FieldMappingTable() {
  return (
    <section id="fields" className="space-y-5">
      <SectionHeader
        eyebrow="Technical"
        title="字段映射表"
        description="Interlace 返回的银行账户信息可以读取并展示，但是否落库、何时客户可见，需要按字段逐项确认。"
        badges={['Field Contract', 'Demo Data']}
      />
      <Card>
        <CardHeader>
          <CardTitle>Application / Account Field Mapping</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Storage</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fieldMappings.map(([field, description, storage, visibility, notes]) => (
                <TableRow key={field}>
                  <TableCell className="font-mono text-xs">{field}</TableCell>
                  <TableCell>{description}</TableCell>
                  <TableCell>{storage}</TableCell>
                  <TableCell><Badge variant={visibilityVariant(visibility)}>{visibility}</Badge></TableCell>
                  <TableCell>{notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  )
}
